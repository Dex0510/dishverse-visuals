
import apiClient from './api';

export interface SalesSummary {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  periodComparison: number; // percentage change from previous period
  salesByHour: Array<{ hour: number; sales: number }>;
  salesByDay: Array<{ date: string; sales: number }>;
  salesByCategory: Array<{ category: string; sales: number }>;
}

export interface TopSellingItem {
  id: string;
  name: string;
  quantity: number;
  totalSales: number;
  percentageOfSales: number;
}

export interface InventoryReport {
  lowStockItems: Array<{ id: string; name: string; currentStock: number; minimumStock: number }>;
  wastageReport: Array<{ itemName: string; quantity: number; cost: number }>;
  inventoryValuation: number;
  inventoryTurnover: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  topCustomers: Array<{ 
    id: string; 
    name: string; 
    orderCount: number; 
    totalSpent: number;
    averageOrderValue: number;
  }>;
  customerRetentionRate: number;
}

export interface StaffPerformance {
  id: string;
  name: string;
  role: string;
  ordersProcessed: number;
  salesAmount: number;
  averageOrderProcessingTime: number;
  customerRating?: number;
}

export const getSalesSummary = async (
  period: 'day' | 'week' | 'month' | 'year',
  startDate?: string,
  endDate?: string
): Promise<SalesSummary> => {
  try {
    const params = { period, startDate, endDate };
    const response = await apiClient.get<SalesSummary>('/reports/sales', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    throw error;
  }
};

export const getTopSellingItems = async (
  period: 'day' | 'week' | 'month' | 'year',
  limit: number = 10
): Promise<TopSellingItem[]> => {
  try {
    const params = { period, limit };
    const response = await apiClient.get<TopSellingItem[]>('/reports/top-selling', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching top selling items:', error);
    throw error;
  }
};

export const getInventoryReport = async (): Promise<InventoryReport> => {
  try {
    const response = await apiClient.get<InventoryReport>('/reports/inventory');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory report:', error);
    throw error;
  }
};

export const getCustomerMetrics = async (
  period: 'day' | 'week' | 'month' | 'year'
): Promise<CustomerMetrics> => {
  try {
    const params = { period };
    const response = await apiClient.get<CustomerMetrics>('/reports/customer-metrics', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching customer metrics:', error);
    throw error;
  }
};

export const getStaffPerformance = async (
  period: 'day' | 'week' | 'month'
): Promise<StaffPerformance[]> => {
  try {
    const params = { period };
    const response = await apiClient.get<StaffPerformance[]>('/reports/staff-performance', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching staff performance:', error);
    throw error;
  }
};
