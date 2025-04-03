
import apiClient from './api';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  status: 'waiting' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  modifiers?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery' | 'online';
  customer: {
    id?: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  discountCode?: string;
  tip?: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partially_refunded';
  paymentMethod?: 'cash' | 'card' | 'upi' | 'online' | 'wallet' | 'credit';
  staffId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  tableId?: string;
  orderType: Order['orderType'];
  customer: Order['customer'];
  items: Array<{
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
    modifiers?: Array<{
      id: string;
      quantity: number;
    }>;
  }>;
  discount?: number;
  discountCode?: string;
  tip?: number;
  paymentMethod?: Order['paymentMethod'];
  notes?: string;
}

export const getOrders = async (status?: Order['status'], dateRange?: { start: string; end: string }): Promise<Order[]> => {
  try {
    const params = { ...status && { status }, ...dateRange };
    const response = await apiClient.get<Order[]>('/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrder = async (id: string): Promise<Order> => {
  try {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  try {
    const response = await apiClient.post<Order>('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order> => {
  try {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    throw error;
  }
};

export const updateOrderItemStatus = async (
  orderId: string,
  itemId: string,
  status: OrderItem['status']
): Promise<OrderItem> => {
  try {
    const response = await apiClient.patch<OrderItem>(
      `/orders/${orderId}/items/${itemId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating order item status:`, error);
    throw error;
  }
};

export const processPayment = async (
  orderId: string,
  paymentDetails: {
    method: Order['paymentMethod'];
    amount: number;
    tip?: number;
    cardDetails?: any; // For card payments
    upiDetails?: any; // For UPI payments
  }
): Promise<{ success: boolean; transactionId?: string; receipt?: string }> => {
  try {
    const response = await apiClient.post(
      `/orders/${orderId}/payment`,
      paymentDetails
    );
    return response.data;
  } catch (error) {
    console.error(`Error processing payment for order ${orderId}:`, error);
    throw error;
  }
};

export const addItemToOrder = async (
  orderId: string,
  item: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
    modifiers?: any[];
  }
): Promise<Order> => {
  try {
    const response = await apiClient.post<Order>(`/orders/${orderId}/items`, item);
    return response.data;
  } catch (error) {
    console.error(`Error adding item to order ${orderId}:`, error);
    throw error;
  }
};

export const removeItemFromOrder = async (orderId: string, itemId: string): Promise<Order> => {
  try {
    const response = await apiClient.delete<Order>(`/orders/${orderId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing item from order ${orderId}:`, error);
    throw error;
  }
};

export const applyDiscount = async (
  orderId: string,
  discountData: { code?: string; amount?: number; type?: 'percentage' | 'fixed' }
): Promise<Order> => {
  try {
    const response = await apiClient.post<Order>(`/orders/${orderId}/discount`, discountData);
    return response.data;
  } catch (error) {
    console.error(`Error applying discount to order ${orderId}:`, error);
    throw error;
  }
};

export const splitOrder = async (
  orderId: string,
  splitConfig: Array<{
    items: Array<{ itemId: string; quantity: number }>;
    paymentMethod?: Order['paymentMethod'];
  }>
): Promise<{ originalOrder: Order; newOrders: Order[] }> => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/split`, { splits: splitConfig });
    return response.data;
  } catch (error) {
    console.error(`Error splitting order ${orderId}:`, error);
    throw error;
  }
};
