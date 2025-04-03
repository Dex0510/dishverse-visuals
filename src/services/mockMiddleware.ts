
import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Mock data
const mockTables = [
  { id: "1", name: "Table 1", capacity: 4, status: "available", section: "main" },
  { id: "2", name: "Table 2", capacity: 2, status: "occupied", section: "main" },
  { id: "3", name: "Table 3", capacity: 6, status: "available", section: "main" },
  { id: "4", name: "Table 4", capacity: 4, status: "reserved", section: "main" },
  { id: "5", name: "Table 5", capacity: 4, status: "available", section: "outdoor" },
  { id: "6", name: "Table 6", capacity: 4, status: "cleaning", section: "outdoor" },
  { id: "7", name: "Table 7", capacity: 8, status: "available", section: "private" },
  { id: "8", name: "Table 8", capacity: 4, status: "reserved", section: "private" },
];

const mockSections = [
  {
    id: "main",
    name: "Main Floor",
    capacity: 40,
    tables: mockTables.filter(table => table.section === "main"),
  },
  {
    id: "outdoor",
    name: "Outdoor Patio",
    capacity: 20,
    tables: mockTables.filter(table => table.section === "outdoor"),
  },
  {
    id: "private",
    name: "Private Room",
    capacity: 12,
    tables: mockTables.filter(table => table.section === "private"),
  },
];

// Mock API handlers
const mockHandlers: Record<string, (config: any) => AxiosResponse<any>> = {
  'GET /tables': () => ({ 
    data: mockTables,
    status: 200, 
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }),
  'GET /sections': () => ({ 
    data: mockSections,
    status: 200, 
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }),
  // Add more mock endpoints as needed
};

export const setupMockMiddleware = (apiClient: AxiosInstance): void => {
  // Add request interceptor for mock handling
  apiClient.interceptors.request.use(
    async (config) => {
      const useMock = !config.url?.includes('api.') && !config.url?.includes('http');
      
      if (useMock && config.url) {
        const mockKey = `${config.method?.toUpperCase()} ${config.url}`;
        
        // Check if we have a mock handler for this request
        if (mockHandlers[mockKey]) {
          // Cancel the real request
          config.adapter = () => {
            return new Promise(resolve => {
              const mockResponse = mockHandlers[mockKey](config);
              console.log(`[Mock API] ${mockKey}`, mockResponse.data);
              resolve(mockResponse);
            });
          };
        } else {
          console.warn(`[Mock API] No handler for ${mockKey}`);
        }
      }
      
      return config;
    },
    error => Promise.reject(error)
  );
};

export default setupMockMiddleware;
