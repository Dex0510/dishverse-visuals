
import apiClient from './api';

// Define common interfaces used across the restaurant management system

// Menu Items
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  image?: string;
  isAvailable: boolean;
}

// Inventory
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

// Suppliers
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

// Tables & Reservations
export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  section: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
  tableId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes: string;
}

// Orders
export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions: string;
  status: 'waiting' | 'preparing' | 'ready' | 'delivered';
}

export interface Order {
  id: string;
  tableId: string | null;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  paymentStatus: 'pending' | 'paid';
  paymentMethod: 'cash' | 'card' | 'online';
  createdAt: string;
  updatedAt: string;
}

// Customers
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  totalSpent: number;
  favoriteItems: string[];
  tags: string[];
  notes: string;
}

// Loyalty Programs
export interface LoyaltyProgram {
  id: string;
  name: string;
  minimumSpend: number;
  discount: string;
  description: string;
}

// Menu Management API
export const menuAPI = {
  getMenuItems: async (): Promise<MenuItem[]> => {
    try {
      const response = await apiClient.get<MenuItem[]>('/menu');
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },
  
  getMenuItem: async (id: string): Promise<MenuItem> => {
    try {
      const response = await apiClient.get<MenuItem>(`/menu/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching menu item ${id}:`, error);
      throw error;
    }
  },
  
  createMenuItem: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    try {
      const response = await apiClient.post<MenuItem>('/menu', item);
      return response.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },
  
  updateMenuItem: async (id: string, item: Partial<MenuItem>): Promise<MenuItem> => {
    try {
      const response = await apiClient.put<MenuItem>(`/menu/${id}`, item);
      return response.data;
    } catch (error) {
      console.error(`Error updating menu item ${id}:`, error);
      throw error;
    }
  },
  
  deleteMenuItem: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.delete<{ success: boolean }>(`/menu/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting menu item ${id}:`, error);
      throw error;
    }
  },
  
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<string[]>('/menu/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

// Inventory Management API
export const inventoryAPI = {
  getInventory: async (): Promise<InventoryItem[]> => {
    try {
      const response = await apiClient.get<InventoryItem[]>('/inventory');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  },
  
  updateInventoryItem: async (id: string, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    try {
      const response = await apiClient.put<InventoryItem>(`/inventory/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating inventory item ${id}:`, error);
      throw error;
    }
  },
  
  createInventoryItem: async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem> => {
    try {
      const response = await apiClient.post<InventoryItem>('/inventory', item);
      return response.data;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  },
  
  getSuppliers: async (): Promise<Supplier[]> => {
    try {
      const response = await apiClient.get<Supplier[]>('/suppliers');
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },
  
  createSupplier: async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
    try {
      const response = await apiClient.post<Supplier>('/suppliers', supplier);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  }
};

// Table Management API
export const tableAPI = {
  getTables: async (): Promise<Table[]> => {
    try {
      const response = await apiClient.get<Table[]>('/tables');
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  },
  
  updateTableStatus: async (id: string, status: Table['status']): Promise<Table> => {
    try {
      const response = await apiClient.patch<Table>(`/tables/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating table ${id} status:`, error);
      throw error;
    }
  },
  
  getReservations: async (date?: string): Promise<Reservation[]> => {
    try {
      const params = date ? { date } : {};
      const response = await apiClient.get<Reservation[]>('/reservations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },
  
  createReservation: async (reservation: Omit<Reservation, 'id'>): Promise<Reservation> => {
    try {
      const response = await apiClient.post<Reservation>('/reservations', reservation);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },
  
  updateReservation: async (id: string, data: Partial<Reservation>): Promise<Reservation> => {
    try {
      const response = await apiClient.put<Reservation>(`/reservations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  }
};

// Order Management API
export const orderAPI = {
  getOrders: async (status?: Order['status']): Promise<Order[]> => {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get<Order[]>('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  
  getOrder: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },
  
  createOrder: async (order: {
    tableId?: string;
    customer: Order['customer'];
    items: Array<{ menuItemId: string; quantity: number; specialInstructions?: string }>;
    paymentMethod: Order['paymentMethod'];
  }): Promise<Order> => {
    try {
      const response = await apiClient.post<Order>('/orders', order);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    try {
      const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id} status:`, error);
      throw error;
    }
  },
  
  updateOrderItemStatus: async (
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
  },
  
  processPayment: async (
    orderId: string, 
    paymentMethod: Order['paymentMethod'],
    amount: number
  ): Promise<{ success: boolean; transactionId?: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; transactionId?: string }>(
        `/orders/${orderId}/payment`,
        { paymentMethod, amount }
      );
      return response.data;
    } catch (error) {
      console.error(`Error processing payment for order ${orderId}:`, error);
      throw error;
    }
  }
};

// Customer Management API
export const customerAPI = {
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await apiClient.get<Customer[]>('/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
  
  getCustomer: async (id: string): Promise<Customer> => {
    try {
      const response = await apiClient.get<Customer>(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },
  
  createCustomer: async (customer: Omit<Customer, 'id' | 'visits' | 'lastVisit' | 'totalSpent' | 'favoriteItems'>): Promise<Customer> => {
    try {
      const response = await apiClient.post<Customer>('/customers', customer);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },
  
  updateCustomer: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await apiClient.put<Customer>(`/customers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },
  
  getLoyaltyPrograms: async (): Promise<LoyaltyProgram[]> => {
    try {
      const response = await apiClient.get<LoyaltyProgram[]>('/loyalty-programs');
      return response.data;
    } catch (error) {
      console.error('Error fetching loyalty programs:', error);
      throw error;
    }
  },
  
  createLoyaltyProgram: async (program: Omit<LoyaltyProgram, 'id'>): Promise<LoyaltyProgram> => {
    try {
      const response = await apiClient.post<LoyaltyProgram>('/loyalty-programs', program);
      return response.data;
    } catch (error) {
      console.error('Error creating loyalty program:', error);
      throw error;
    }
  }
};

// Analytics API
export const analyticsAPI = {
  getSalesSummary: async (
    period: 'day' | 'week' | 'month' | 'year', 
    start?: string, 
    end?: string
  ) => {
    try {
      const params = { period, start, end };
      const response = await apiClient.get('/analytics/sales', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales summary:', error);
      throw error;
    }
  },
  
  getTopSellingItems: async (
    limit: number = 5, 
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ) => {
    try {
      const params = { limit, period };
      const response = await apiClient.get('/analytics/top-items', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching top selling items:', error);
      throw error;
    }
  },
  
  getCategorySales: async (
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ) => {
    try {
      const params = { period };
      const response = await apiClient.get('/analytics/category-sales', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching category sales:', error);
      throw error;
    }
  },
  
  getCustomerMetrics: async () => {
    try {
      const response = await apiClient.get('/analytics/customer-metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer metrics:', error);
      throw error;
    }
  },
  
  getOperationalMetrics: async () => {
    try {
      const response = await apiClient.get('/analytics/operational-metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching operational metrics:', error);
      throw error;
    }
  }
};

// Export all APIs as a combined service
const restaurantService = {
  menu: menuAPI,
  inventory: inventoryAPI,
  tables: tableAPI,
  orders: orderAPI,
  customers: customerAPI,
  analytics: analyticsAPI
};

export default restaurantService;
