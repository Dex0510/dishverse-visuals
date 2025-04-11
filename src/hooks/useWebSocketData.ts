
import { useEffect, useState, useCallback, useRef } from 'react';
import webSocketService, { WebSocketEventType } from '@/services/webSocketService';

/**
 * Hook to subscribe to WebSocket events and update state with fallback to polling
 * @param eventType WebSocket event type to subscribe to
 * @param initialData Initial data state
 * @param fallbackFetchFn Optional fallback fetch function to use when WebSocket is not available
 * @param pollingInterval Optional polling interval in milliseconds (default: 10000ms)
 * @returns The current data state that updates in real-time via WebSocket or polling
 */
export function useWebSocketData<T>(
  eventType: WebSocketEventType, 
  initialData: T, 
  fallbackFetchFn?: () => Promise<T>,
  pollingInterval = 10000
): T {
  const [data, setData] = useState<T>(initialData);
  const [isPolling, setIsPolling] = useState(false);
  const pollingTimeoutRef = useRef<number | null>(null);
  
  // Cleanup function for polling
  const cleanupPolling = useCallback(() => {
    if (pollingTimeoutRef.current !== null) {
      window.clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }, []);
  
  // Start polling function
  const startPolling = useCallback(() => {
    if (!fallbackFetchFn || isPolling) return;
    
    setIsPolling(true);
    console.log(`WebSocket unavailable for ${eventType}, falling back to polling`);
    
    const poll = async () => {
      try {
        const freshData = await fallbackFetchFn();
        setData(freshData);
      } catch (error) {
        console.error(`Polling error for ${eventType}:`, error);
      }
      
      // Schedule next poll
      pollingTimeoutRef.current = window.setTimeout(poll, pollingInterval);
    };
    
    // Start polling immediately
    poll();
  }, [eventType, fallbackFetchFn, isPolling, pollingInterval]);
  
  useEffect(() => {
    // Set initial data when it changes from props
    setData(initialData);
    
    // Set up WebSocket listener
    const handleUpdate = (updatedData: T) => {
      setData(updatedData);
      
      // If we're polling but WebSocket is working, stop polling
      if (isPolling) {
        cleanupPolling();
        setIsPolling(false);
      }
    };
    
    // Try to use WebSocket first
    const isConnected = webSocketService.isConnected();
    
    if (isConnected) {
      webSocketService.addEventListener(eventType, handleUpdate);
    } else if (fallbackFetchFn) {
      // If WebSocket is not connected and we have a fallback fetch function, start polling
      startPolling();
    }
    
    // Try to connect WebSocket if it's not connected
    if (!isConnected) {
      webSocketService.connect()
        .then(() => {
          webSocketService.addEventListener(eventType, handleUpdate);
          
          // If connection successful and we were polling, stop polling
          if (isPolling) {
            cleanupPolling();
            setIsPolling(false);
          }
        })
        .catch(() => {
          // If connection fails and we have a fallback, ensure polling is active
          if (fallbackFetchFn && !isPolling) {
            startPolling();
          }
        });
    }
    
    // Clean up listener and polling on unmount
    return () => {
      webSocketService.removeEventListener(eventType, handleUpdate);
      cleanupPolling();
    };
  }, [eventType, initialData, fallbackFetchFn, isPolling, startPolling, cleanupPolling]);
  
  return data;
}

/**
 * Hook to send WebSocket messages
 * @returns A function to send WebSocket messages
 */
export function useWebSocketSend() {
  return (type: string, data: any) => {
    webSocketService.sendMessage(type, data);
  };
}

/**
 * Hook to track WebSocket connection status
 * @returns Whether the WebSocket is currently connected
 */
export function useWebSocketStatus() {
  const [isConnected, setIsConnected] = useState(webSocketService.isConnected());
  
  useEffect(() => {
    const handleConnection = () => {
      setIsConnected(true);
    };
    
    const handleDisconnection = () => {
      setIsConnected(false);
    };
    
    // Set up connection event listeners
    webSocketService.addConnectionListener('connected', handleConnection);
    webSocketService.addConnectionListener('disconnected', handleDisconnection);
    
    // Set initial status
    setIsConnected(webSocketService.isConnected());
    
    // Try to connect if not already connected
    if (!webSocketService.isConnected()) {
      webSocketService.connect().catch(() => {
        setIsConnected(false);
      });
    }
    
    // Clean up listeners on unmount
    return () => {
      webSocketService.removeConnectionListener('connected', handleConnection);
      webSocketService.removeConnectionListener('disconnected', handleDisconnection);
    };
  }, []);
  
  return isConnected;
}
