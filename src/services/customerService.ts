
import apiClient from './api';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  joinDate: string;
  lastVisit?: string;
  visits: number;
  totalSpent: number;
  loyaltyPoints: number;
  tags: string[];
  preferences?: {
    favoriteDishes?: string[];
    dietaryRestrictions?: string[];
    allergies?: string[];
  };
  notes?: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsMultiplier: number;
  rules: {
    pointsPerCurrency: number; // e.g., 1 point per $10 spent
    minimumSpend?: number;
    expiresAfterDays?: number;
  };
  rewards: Array<{
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
    discountPercentage?: number;
    discountAmount?: number;
    freeItem?: string;
  }>;
}

export const getCustomers = async (search?: string): Promise<Customer[]> => {
  try {
    const params = search ? { search } : {};
    const response = await apiClient.get<Customer[]>('/customers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomer = async (id: string): Promise<Customer> => {
  try {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'visits' | 'totalSpent' | 'loyaltyPoints' | 'joinDate'>): Promise<Customer> => {
  try {
    const response = await apiClient.post<Customer>('/customers', customer);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id: string, data: Partial<Customer>): Promise<Customer> => {
  try {
    const response = await apiClient.put<Customer>(`/customers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    throw error;
  }
};

export const getCustomerOrderHistory = async (id: string): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/customers/${id}/orders`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order history for customer ${id}:`, error);
    throw error;
  }
};

export const getLoyaltyPrograms = async (): Promise<LoyaltyProgram[]> => {
  try {
    const response = await apiClient.get<LoyaltyProgram[]>('/loyalty-programs');
    return response.data;
  } catch (error) {
    console.error('Error fetching loyalty programs:', error);
    throw error;
  }
};

export const createLoyaltyProgram = async (program: Omit<LoyaltyProgram, 'id'>): Promise<LoyaltyProgram> => {
  try {
    const response = await apiClient.post<LoyaltyProgram>('/loyalty-programs', program);
    return response.data;
  } catch (error) {
    console.error('Error creating loyalty program:', error);
    throw error;
  }
};

export const updateLoyaltyProgram = async (id: string, data: Partial<LoyaltyProgram>): Promise<LoyaltyProgram> => {
  try {
    const response = await apiClient.put<LoyaltyProgram>(`/loyalty-programs/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating loyalty program ${id}:`, error);
    throw error;
  }
};

export const redeemLoyaltyReward = async (
  customerId: string,
  rewardId: string
): Promise<{ success: boolean; pointsRemaining: number }> => {
  try {
    const response = await apiClient.post(`/customers/${customerId}/redeem-reward`, { rewardId });
    return response.data;
  } catch (error) {
    console.error('Error redeeming loyalty reward:', error);
    throw error;
  }
};
