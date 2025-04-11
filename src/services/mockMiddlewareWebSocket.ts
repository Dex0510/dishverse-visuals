
import { WebSocketEventType } from './webSocketService';

// Mock WebSocket server implementation
class MockWebSocketServer {
  private static instance: MockWebSocketServer;
  private listeners: Map<WebSocketEventType, Function[]> = new Map();
  
  private constructor() {}
  
  public static getInstance(): MockWebSocketServer {
    if (!MockWebSocketServer.instance) {
      MockWebSocketServer.instance = new MockWebSocketServer();
    }
    return MockWebSocketServer.instance;
  }
  
  public addEventListener(eventType: WebSocketEventType, callback: Function): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }
  
  public removeEventListener(eventType: WebSocketEventType, callback: Function): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  public emit(eventType: WebSocketEventType, data: any): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in mock WebSocket listener for ${eventType}:`, error);
        }
      });
    }
  }
}

export const mockWebSocketServer = MockWebSocketServer.getInstance();

// Mock a custom implementation of WebSocket for development/testing
export class MockWebSocket {
  private onmessageHandler: ((event: {data: string}) => void) | null = null;
  private onopenHandler: (() => void) | null = null;
  private oncloseHandler: ((event: any) => void) | null = null;
  private onerrorHandler: ((error: any) => void) | null = null;
  
  constructor(url: string) {
    // Simulate connection establishment
    setTimeout(() => {
      if (this.onopenHandler) {
        this.onopenHandler();
      }
    }, 100);
  }
  
  set onmessage(handler: (event: {data: string}) => void) {
    this.onmessageHandler = handler;
  }
  
  set onopen(handler: () => void) {
    this.onopenHandler = handler;
  }
  
  set onclose(handler: (event: any) => void) {
    this.oncloseHandler = handler;
  }
  
  set onerror(handler: (error: any) => void) {
    this.onerrorHandler = handler;
  }
  
  close(): void {
    if (this.oncloseHandler) {
      this.oncloseHandler({ code: 1000, reason: 'Mock close' });
    }
  }
  
  send(data: string): void {
    try {
      const message = JSON.parse(data);
      console.log('Mock WebSocket message sent:', message);
      
      // If this is a real implementation, the message would be sent to the server
      // and processed. Here we just log it.
    } catch (error) {
      console.error('Error parsing message in mock WebSocket:', error);
    }
  }
  
  // Method to simulate receiving a message from the server
  receiveMessage(type: WebSocketEventType, data: any): void {
    if (this.onmessageHandler) {
      const message = JSON.stringify({ type, data });
      this.onmessageHandler({ data: message });
    }
  }
}

// Replace the global WebSocket with our mock implementation in development
// This should only be done in a development environment
if (process.env.NODE_ENV === 'development') {
  (window as any).OriginalWebSocket = window.WebSocket;
  (window as any).WebSocket = MockWebSocket;
}
