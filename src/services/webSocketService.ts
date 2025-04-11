
import { toast } from 'sonner';

// WebSocket events that can be listened to
export type WebSocketEventType = 
  | 'table_status_update' 
  | 'waitlist_update' 
  | 'order_update'
  | 'occupancy_update';

// Type for event listeners
type EventListener = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 2000; // Start with 2 seconds
  private eventListeners: Map<WebSocketEventType, EventListener[]> = new Map();

  constructor() {
    // In a real app, this would come from environment variables
    this.url = 'ws://localhost:8080';
  }

  // Connect to the WebSocket server
  connect(): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    if (this.isConnecting) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onclose = (event) => {
          console.log('WebSocket connection closed', event);
          this.socket = null;
          this.handleReconnect();
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Only reject if we're in the initial connection attempt
          if (this.isConnecting) {
            this.isConnecting = false;
            reject(error);
          }
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type && message.data) {
              this.dispatchEvent(message.type as WebSocketEventType, message.data);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        this.isConnecting = false;
        console.error('Failed to create WebSocket connection:', error);
        this.handleReconnect();
        reject(error);
      }
    });
  }

  // Attempt to reconnect with exponential backoff
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnect attempts reached, giving up');
      toast.error('Unable to connect to real-time updates. Please refresh the page.');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(30000, this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1));
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(() => {
        // Error handling is done in the connect method
      });
    }, delay);
  }

  // Disconnect from the WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Add event listener
  addEventListener(event: WebSocketEventType, listener: EventListener): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(listener);
  }

  // Remove event listener
  removeEventListener(event: WebSocketEventType, listener: EventListener): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Dispatch event to all listeners
  private dispatchEvent(event: WebSocketEventType, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Send message to the server
  sendMessage(type: string, data: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, data }));
    } else {
      console.error('WebSocket not connected, unable to send message');
      // Try to reconnect and then send the message
      this.connect().then(() => {
        this.sendMessage(type, data);
      }).catch(error => {
        console.error('Failed to reconnect WebSocket:', error);
        toast.error('Unable to send update. Please check your connection.');
      });
    }
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
