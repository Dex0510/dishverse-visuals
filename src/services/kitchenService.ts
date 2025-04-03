
import apiClient from './api';
import { OrderItem } from './restaurantService';

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableId: string | null;
  tableName: string | null;
  customerName: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  items: OrderItem[];
  priority: 'normal' | 'high' | 'rush';
  notes: string;
  createdAt: string;
  estimatedCompletionTime: string;
}

export const getKitchenOrders = async (): Promise<KitchenOrder[]> => {
  try {
    const response = await apiClient.get<KitchenOrder[]>('/kitchen/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching kitchen orders:', error);
    throw error;
  }
};

export const updateItemStatus = async (
  orderId: string,
  itemId: string,
  status: OrderItem['status']
): Promise<OrderItem> => {
  try {
    const response = await apiClient.patch<OrderItem>(
      `/kitchen/orders/${orderId}/items/${itemId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating item status for order ${orderId}:`, error);
    throw error;
  }
};

export const completeOrder = async (orderId: string): Promise<KitchenOrder> => {
  try {
    const response = await apiClient.post<KitchenOrder>(`/kitchen/orders/${orderId}/complete`, {});
    return response.data;
  } catch (error) {
    console.error(`Error completing kitchen order ${orderId}:`, error);
    throw error;
  }
};

export const updateOrderPriority = async (
  orderId: string,
  priority: KitchenOrder['priority']
): Promise<KitchenOrder> => {
  try {
    const response = await apiClient.patch<KitchenOrder>(
      `/kitchen/orders/${orderId}/priority`,
      { priority }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating priority for order ${orderId}:`, error);
    throw error;
  }
};
