
import apiClient from './api';
import webSocketService from './webSocketService';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  image?: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  nutritionalInfo?: {
    calories: number;
    protein: number; // in grams
    carbs: number; // in grams
    fat: number; // in grams
    allergens: string[];
  };
  tags: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
}

// Function to register menu item listeners with WebSocket service
export const registerMenuWebSocketListeners = () => {
  // We register this on initial import so the WebSocket service knows about these event types
  webSocketService.registerEventType('menu_items_updated');
  webSocketService.registerEventType('menu_item_updated');
  webSocketService.registerEventType('menu_item_created');
  webSocketService.registerEventType('menu_item_deleted');
  webSocketService.registerEventType('menu_categories_updated');
};

// Register listeners immediately
registerMenuWebSocketListeners();

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const response = await apiClient.get<MenuItem[]>('/menu');
    
    // Notify the WebSocket service about this data so it can use it for mock purposes
    webSocketService.updateMockData('menu_items_updated', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const getMenuItem = async (id: string): Promise<MenuItem> => {
  try {
    const response = await apiClient.get<MenuItem>(`/menu/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    throw error;
  }
};

export const createMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  try {
    // Create FormData if there's an image to upload
    if (typeof item.image === 'object') {
      const formData = new FormData();
      
      // Add all item properties except image
      Object.keys(item).forEach(key => {
        if (key !== 'image') {
          if (typeof item[key] === 'object') {
            formData.append(key, JSON.stringify(item[key]));
          } else {
            formData.append(key, item[key]);
          }
        }
      });
      
      // Add image if it exists
      if (item.image) {
        formData.append('image', item.image);
      }
      
      const response = await apiClient.post<MenuItem>('/menu', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Notify via WebSocket about the new item
      webSocketService.sendMessage('menu_item_created', response.data);
      
      return response.data;
    } else {
      // Standard JSON request if no image upload
      const response = await apiClient.post<MenuItem>('/menu', item);
      
      // Notify via WebSocket about the new item
      webSocketService.sendMessage('menu_item_created', response.data);
      
      return response.data;
    }
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<MenuItem> => {
  try {
    // Use FormData if there's an image to upload
    if (typeof item.image === 'object') {
      const formData = new FormData();
      
      // Add all item properties except image
      Object.keys(item).forEach(key => {
        if (key !== 'image') {
          if (typeof item[key] === 'object') {
            formData.append(key, JSON.stringify(item[key]));
          } else {
            formData.append(key, item[key]);
          }
        }
      });
      
      // Add image if it exists
      if (item.image) {
        formData.append('image', item.image);
      }
      
      const response = await apiClient.put<MenuItem>(`/menu/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Notify via WebSocket about the updated item
      webSocketService.sendMessage('menu_item_updated', response.data);
      
      return response.data;
    } else {
      // Standard JSON request if no image upload
      const response = await apiClient.put<MenuItem>(`/menu/${id}`, item);
      
      // Notify via WebSocket about the updated item
      webSocketService.sendMessage('menu_item_updated', response.data);
      
      return response.data;
    }
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<{ success: boolean }>(`/menu/${id}`);
    
    // Notify via WebSocket about the deleted item
    if (response.data.success) {
      webSocketService.sendMessage('menu_item_deleted', { id });
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    throw error;
  }
};

export const getCategories = async (): Promise<MenuCategory[]> => {
  try {
    const response = await apiClient.get<MenuCategory[]>('/menu/categories');
    
    // Update WebSocket mock data
    webSocketService.updateMockData('menu_categories_updated', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    throw error;
  }
};

export const createCategory = async (category: Omit<MenuCategory, 'id'>): Promise<MenuCategory> => {
  try {
    const response = await apiClient.post<MenuCategory>('/menu/categories', category);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, data: Partial<MenuCategory>): Promise<MenuCategory> => {
  try {
    const response = await apiClient.put<MenuCategory>(`/menu/categories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<{ success: boolean }>(`/menu/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};

export const getIngredientSuggestions = async (partialName: string): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>(`/menu/ingredient-suggestions?query=${partialName}`);
    return response.data;
  } catch (error) {
    console.error('Error getting ingredient suggestions:', error);
    throw error;
  }
};

export const generateDishDescription = async (name: string, ingredients: string[]): Promise<string> => {
  try {
    const response = await apiClient.post<{ description: string }>('/ai/generate-description', { 
      name, 
      ingredients 
    });
    return response.data.description;
  } catch (error) {
    console.error('Error generating dish description:', error);
    throw error;
  }
};
