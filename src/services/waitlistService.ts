
import apiClient from './api';

export interface WaitlistEntry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  estimatedWaitTime: number; // in minutes
  status: 'waiting' | 'seated' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: string;
  notified: boolean;
  tablePreference?: string;
}

export interface WaitTimeEstimate {
  partySize: number;
  estimatedMinutes: number;
  confidence: 'high' | 'medium' | 'low';
}

// Get all waitlist entries
export const getWaitlist = async (): Promise<WaitlistEntry[]> => {
  try {
    const response = await apiClient.get<WaitlistEntry[]>('/waitlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    throw error;
  }
};

// Add new waitlist entry
export const addToWaitlist = async (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'estimatedWaitTime' | 'notified' | 'status'>): Promise<WaitlistEntry> => {
  try {
    const response = await apiClient.post<WaitlistEntry>('/waitlist', {
      ...entry,
      status: 'waiting',
      notified: false,
      createdAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    throw error;
  }
};

// Update waitlist entry
export const updateWaitlistEntry = async (id: string, updates: Partial<WaitlistEntry>): Promise<WaitlistEntry> => {
  try {
    const response = await apiClient.put<WaitlistEntry>(`/waitlist/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating waitlist entry ${id}:`, error);
    throw error;
  }
};

// Remove from waitlist
export const removeFromWaitlist = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/waitlist/${id}`);
  } catch (error) {
    console.error(`Error removing from waitlist (entry ${id}):`, error);
    throw error;
  }
};

// Get current wait time estimate based on party size
export const getWaitTimeEstimate = async (partySize: number): Promise<WaitTimeEstimate> => {
  try {
    const response = await apiClient.get<WaitTimeEstimate>(`/waitlist/estimate?partySize=${partySize}`);
    return response.data;
  } catch (error) {
    console.error('Error getting wait time estimate:', error);
    // Return a fallback estimate
    return {
      partySize,
      estimatedMinutes: partySize * 5, // Simple fallback calculation
      confidence: 'low'
    };
  }
};

// Notify customer that their table is ready
export const notifyCustomer = async (id: string, method: 'sms' | 'email' | 'push'): Promise<{success: boolean; message: string}> => {
  try {
    const response = await apiClient.post<{success: boolean; message: string}>(`/waitlist/${id}/notify`, { method });
    return response.data;
  } catch (error) {
    console.error(`Error notifying customer (entry ${id}):`, error);
    throw error;
  }
};

// Mock data for development
export const getMockWaitlist = (): WaitlistEntry[] => {
  return [
    {
      id: '1',
      customerName: 'John Smith',
      customerPhone: '555-123-4567',
      partySize: 4,
      estimatedWaitTime: 20,
      status: 'waiting',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      notified: false,
      notes: 'Prefers window seating'
    },
    {
      id: '2',
      customerName: 'Maria Garcia',
      customerPhone: '555-987-6543',
      customerEmail: 'maria@example.com',
      partySize: 2,
      estimatedWaitTime: 10,
      status: 'waiting',
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      notified: true
    },
    {
      id: '3',
      customerName: 'James Johnson',
      customerPhone: '555-567-8901',
      partySize: 6,
      estimatedWaitTime: 35,
      status: 'waiting',
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
      notified: false,
      tablePreference: 'Private Room'
    },
    {
      id: '4',
      customerName: 'Sophia Lee',
      customerPhone: '555-234-5678',
      customerEmail: 'sophia@example.com',
      partySize: 3,
      estimatedWaitTime: 15,
      status: 'seated',
      createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
      notified: true
    },
    {
      id: '5',
      customerName: 'Michael Brown',
      customerPhone: '555-345-6789',
      partySize: 2,
      estimatedWaitTime: 10,
      status: 'cancelled',
      createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      notified: false
    }
  ];
};
