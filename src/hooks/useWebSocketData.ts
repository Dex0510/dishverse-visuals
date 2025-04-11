
import { useEffect, useState } from 'react';
import webSocketService, { WebSocketEventType } from '@/services/webSocketService';

/**
 * Hook to subscribe to WebSocket events and update state
 * @param eventType WebSocket event type to subscribe to
 * @param initialData Initial data state
 * @returns The current data state that updates in real-time via WebSocket
 */
export function useWebSocketData<T>(eventType: WebSocketEventType, initialData: T): T {
  const [data, setData] = useState<T>(initialData);
  
  useEffect(() => {
    // Set initial data when it changes from props
    setData(initialData);
    
    // Set up WebSocket listener
    const handleUpdate = (updatedData: T) => {
      setData(updatedData);
    };
    
    webSocketService.addEventListener(eventType, handleUpdate);
    
    // Clean up listener on unmount
    return () => {
      webSocketService.removeEventListener(eventType, handleUpdate);
    };
  }, [eventType, initialData]);
  
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
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const checkConnection = () => {
      // This is a simplified way to check - in a real implementation,
      // you'd want to expose the connection status from the WebSocketService
      webSocketService.connect()
        .then(() => setIsConnected(true))
        .catch(() => setIsConnected(false));
    };
    
    // Check initial connection
    checkConnection();
    
    // Set up periodic connection check
    const intervalId = setInterval(checkConnection, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return isConnected;
}
