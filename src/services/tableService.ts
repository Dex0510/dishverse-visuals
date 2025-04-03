
import apiClient from './api';

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  section: string;
  currentOrderId?: string;
}

export interface Reservation {
  id: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  duration: number; // in minutes
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes: string;
}

export interface Section {
  id: string;
  name: string;
  capacity: number;
  tables: Table[];
}

export const getTables = async (): Promise<Table[]> => {
  try {
    const response = await apiClient.get<Table[]>('/tables');
    return response.data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

export const getSections = async (): Promise<Section[]> => {
  try {
    const response = await apiClient.get<Section[]>('/sections');
    return response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
};

export const getReservations = async (date?: string): Promise<Reservation[]> => {
  try {
    const params = date ? { date } : {};
    const response = await apiClient.get<Reservation[]>('/reservations', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export const createReservation = async (reservation: Omit<Reservation, 'id'>): Promise<Reservation> => {
  try {
    const response = await apiClient.post<Reservation>('/reservations', reservation);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const updateReservation = async (id: string, data: Partial<Reservation>): Promise<Reservation> => {
  try {
    const response = await apiClient.put<Reservation>(`/reservations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating reservation ${id}:`, error);
    throw error;
  }
};

export const updateTableStatus = async (id: string, status: Table['status']): Promise<Table> => {
  try {
    const response = await apiClient.patch<Table>(`/tables/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating table ${id} status:`, error);
    throw error;
  }
};

export const assignTableToOrder = async (tableId: string, orderId: string): Promise<Table> => {
  try {
    const response = await apiClient.patch<Table>(`/tables/${tableId}/assign-order`, { orderId });
    return response.data;
  } catch (error) {
    console.error(`Error assigning order to table ${tableId}:`, error);
    throw error;
  }
};
