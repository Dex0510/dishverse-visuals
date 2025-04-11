
import { AxiosInstance } from 'axios';
import { mockWebSocketServer } from './mockMiddlewareWebSocket';

// Setup mock middleware to handle API calls when backend is unavailable
const setupMockMiddleware = (client: AxiosInstance) => {
  // Mock tables data
  const tables = [
    { id: 't1', name: 'Table 1', capacity: 4, status: 'available', section: 'main' },
    { id: 't2', name: 'Table 2', capacity: 2, status: 'occupied', section: 'main', currentOrderId: 'o1' },
    { id: 't3', name: 'Table 3', capacity: 6, status: 'reserved', section: 'main' },
    { id: 't4', name: 'Table 4', capacity: 4, status: 'cleaning', section: 'patio' },
    { id: 't5', name: 'Table 5', capacity: 8, status: 'available', section: 'private' },
    { id: 't6', name: 'Table 6', capacity: 2, status: 'occupied', section: 'bar', currentOrderId: 'o2' },
    { id: 't7', name: 'Table 7', capacity: 4, status: 'available', section: 'main' },
    { id: 't8', name: 'Table 8', capacity: 2, status: 'occupied', section: 'patio', currentOrderId: 'o3' },
  ];
  
  // Mock waitlist data
  const waitlist = [
    { id: 'w1', customerName: 'John Doe', customerPhone: '555-1234', customerEmail: 'john@example.com', partySize: 4, estimatedWaitTime: 15, notes: 'Birthday celebration', status: 'waiting', createdAt: new Date().toISOString() },
    { id: 'w2', customerName: 'Jane Smith', customerPhone: '555-5678', customerEmail: 'jane@example.com', partySize: 2, estimatedWaitTime: 10, notes: '', status: 'waiting', createdAt: new Date().toISOString() },
    { id: 'w3', customerName: 'Bob Johnson', customerPhone: '555-9012', customerEmail: 'bob@example.com', partySize: 6, estimatedWaitTime: 30, notes: 'Window seating preferred', status: 'waiting', createdAt: new Date().toISOString() },
    { id: 'w4', customerName: 'Alice Brown', customerPhone: '555-3456', customerEmail: 'alice@example.com', partySize: 3, estimatedWaitTime: 20, notes: '', status: 'seated', createdAt: new Date(Date.now() - 3600000).toISOString() },
  ];

  // Add response interceptor to mock API responses
  client.interceptors.response.use(
    response => response,
    async error => {
      // Only mock in development and if there's a network error
      if (process.env.NODE_ENV !== 'development' || error.response) {
        return Promise.reject(error);
      }

      const { url, method, data: requestData } = error.config;
      console.log(`Mocking ${method} request to ${url}`);

      // Mock tables endpoint
      if (url.includes('/tables')) {
        if (method === 'get') {
          return { data: tables };
        }
        
        if (method === 'patch' && url.includes('/status')) {
          const tableId = url.split('/').slice(-2)[0];
          const { status } = JSON.parse(requestData);
          
          const tableIndex = tables.findIndex(t => t.id === tableId);
          if (tableIndex !== -1) {
            tables[tableIndex].status = status;
            
            // Emit via mock WebSocket
            mockWebSocketServer.emit('table_status_update', tables);
            
            return { data: tables[tableIndex] };
          }
        }
        
        if (method === 'patch' && url.includes('/assign-order')) {
          const tableId = url.split('/').slice(-2)[0];
          const { orderId } = JSON.parse(requestData);
          
          const tableIndex = tables.findIndex(t => t.id === tableId);
          if (tableIndex !== -1) {
            tables[tableIndex].currentOrderId = orderId;
            tables[tableIndex].status = 'occupied';
            
            // Emit via mock WebSocket
            mockWebSocketServer.emit('table_status_update', tables);
            
            return { data: tables[tableIndex] };
          }
        }
      }
      
      // Mock waitlist endpoint
      if (url.includes('/waitlist')) {
        if (method === 'get') {
          return { data: waitlist };
        }
        
        if (method === 'post' && !url.includes('/seat')) {
          const newEntry = {
            id: `w${waitlist.length + 1}`,
            ...JSON.parse(requestData),
            createdAt: new Date().toISOString()
          };
          waitlist.push(newEntry);
          
          // Emit via mock WebSocket
          mockWebSocketServer.emit('waitlist_update', waitlist);
          
          return { data: newEntry };
        }
        
        if (method === 'patch') {
          const entryId = url.split('/').slice(-1)[0];
          const updates = JSON.parse(requestData);
          
          const entryIndex = waitlist.findIndex(w => w.id === entryId);
          if (entryIndex !== -1) {
            waitlist[entryIndex] = { ...waitlist[entryIndex], ...updates };
            
            // Emit via mock WebSocket
            mockWebSocketServer.emit('waitlist_update', waitlist);
            
            return { data: waitlist[entryIndex] };
          }
        }
        
        if (method === 'delete') {
          const entryId = url.split('/').slice(-1)[0];
          const entryIndex = waitlist.findIndex(w => w.id === entryId);
          
          if (entryIndex !== -1) {
            waitlist.splice(entryIndex, 1);
            
            // Emit via mock WebSocket
            mockWebSocketServer.emit('waitlist_update', waitlist);
            
            return { data: null };
          }
        }
        
        if (method === 'post' && url.includes('/seat')) {
          const entryId = url.split('/').slice(-2)[0];
          const { tableId } = JSON.parse(requestData);
          
          const entryIndex = waitlist.findIndex(w => w.id === entryId);
          const tableIndex = tables.findIndex(t => t.id === tableId);
          
          if (entryIndex !== -1 && tableIndex !== -1) {
            waitlist[entryIndex].status = 'seated';
            tables[tableIndex].status = 'occupied';
            
            // Emit via mock WebSocket
            mockWebSocketServer.emit('waitlist_update', waitlist);
            mockWebSocketServer.emit('table_status_update', tables);
            
            return { data: null };
          }
        }
      }

      // If no mock implementation, proceed with the error
      return Promise.reject(error);
    }
  );
};

export default setupMockMiddleware;
