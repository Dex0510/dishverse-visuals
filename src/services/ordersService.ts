
import apiClient from './api';

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'paid' | 'pending';
  createdAt: string;
}

export interface CreateOrderRequest {
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: {
    id: string;
    quantity: number;
  }[];
  paymentMethod: 'online' | 'cod';
}

export const createOrder = async (orderData: CreateOrderRequest): Promise<{ orderId: string }> => {
  try {
    const response = await apiClient.post<{ orderId: string }>('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};
