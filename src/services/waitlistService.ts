
import apiClient from './api';
import webSocketService from './webSocketService';

export interface WaitlistEntry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  partySize: number;
  estimatedWaitTime: number;
  notes: string;
  status: 'waiting' | 'seated' | 'cancelled' | 'no-show';
  createdAt: string;
}

export const getWaitlist = async (): Promise<WaitlistEntry[]> => {
  try {
    const response = await apiClient.get<WaitlistEntry[]>('/waitlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    throw error;
  }
};

export const addToWaitlist = async (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>): Promise<WaitlistEntry> => {
  try {
    const response = await apiClient.post<WaitlistEntry>('/waitlist', {
      ...entry,
      status: 'waiting'
    });
    
    // Emit the update via WebSocket
    webSocketService.sendMessage('waitlist_update', { action: 'add', entry: response.data });
    
    return response.data;
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    throw error;
  }
};

export const updateWaitlistEntry = async (id: string, data: Partial<WaitlistEntry>): Promise<WaitlistEntry> => {
  try {
    const response = await apiClient.patch<WaitlistEntry>(`/waitlist/${id}`, data);
    
    // Emit the update via WebSocket
    webSocketService.sendMessage('waitlist_update', { action: 'update', entry: response.data });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating waitlist entry ${id}:`, error);
    throw error;
  }
};

export const removeFromWaitlist = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/waitlist/${id}`);
    
    // Emit the update via WebSocket
    webSocketService.sendMessage('waitlist_update', { action: 'delete', id });
  } catch (error) {
    console.error(`Error removing from waitlist ${id}:`, error);
    throw error;
  }
};

export const seatFromWaitlist = async (waitlistId: string, tableId: string): Promise<void> => {
  try {
    await apiClient.post(`/waitlist/${waitlistId}/seat`, { tableId });
    
    // Emit updates via WebSocket
    webSocketService.sendMessage('waitlist_update', { 
      action: 'update', 
      entry: { id: waitlistId, status: 'seated' } 
    });
    
    webSocketService.sendMessage('table_status_update', { 
      tableId, 
      status: 'occupied' 
    });
  } catch (error) {
    console.error(`Error seating waitlist entry ${waitlistId}:`, error);
    throw error;
  }
};
