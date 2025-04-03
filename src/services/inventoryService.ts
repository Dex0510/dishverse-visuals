
import apiClient from './api';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  price: number;
  supplierId: string;
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: {
    inventoryItemId: string;
    quantity: number;
    price: number;
  }[];
  status: 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  totalAmount: number;
  notes: string;
}

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const response = await apiClient.get<InventoryItem[]>('/inventory');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

export const updateInventoryItem = async (id: string, data: Partial<InventoryItem>): Promise<InventoryItem> => {
  try {
    const response = await apiClient.put<InventoryItem>(`/inventory/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating inventory item ${id}:`, error);
    throw error;
  }
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem> => {
  try {
    const response = await apiClient.post<InventoryItem>('/inventory', item);
    return response.data;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    const response = await apiClient.get<Supplier[]>('/suppliers');
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const createSupplier = async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
  try {
    const response = await apiClient.post<Supplier>('/suppliers', supplier);
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  try {
    const response = await apiClient.get<PurchaseOrder[]>('/purchase-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
};

export const createPurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
  try {
    const response = await apiClient.post<PurchaseOrder>('/purchase-orders', order);
    return response.data;
  } catch (error) {
    console.error('Error creating purchase order:', error);
    throw error;
  }
};

export const updatePurchaseOrder = async (id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
  try {
    const response = await apiClient.put<PurchaseOrder>(`/purchase-orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating purchase order ${id}:`, error);
    throw error;
  }
};

export const receiveInventory = async (
  purchaseOrderId: string, 
  receivedItems: Array<{ itemId: string; quantity: number; }>
): Promise<PurchaseOrder> => {
  try {
    const response = await apiClient.post<PurchaseOrder>(
      `/purchase-orders/${purchaseOrderId}/receive`,
      { receivedItems }
    );
    return response.data;
  } catch (error) {
    console.error('Error receiving inventory:', error);
    throw error;
  }
};
