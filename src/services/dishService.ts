
import apiClient from './api';

export interface DishRequest {
  dish_name: string;
  ingredients: string[];
  description?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unitOfMeasure: string;
  inStock: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface DishIngredient {
  dishId: string;
  ingredientId: string;
  quantity: number;
  units: string;
}

export interface AggregatedResponse {
  image_url: string;
  suggested_ingredients: string[];
  description: string;
  recommended_dish: string;
}

// Process a dish through all AI agents
export const processDish = async (request: DishRequest): Promise<AggregatedResponse> => {
  try {
    const response = await apiClient.post<AggregatedResponse>('/process_dish', request);
    return response.data;
  } catch (error) {
    console.error('Error processing dish:', error);
    throw error;
  }
};

// Call just the 3D image generation service
export const generate3DImage = async (request: DishRequest): Promise<string> => {
  try {
    const response = await apiClient.post<{ image_url: string }>('/generate_3d_image', request);
    return response.data.image_url;
  } catch (error) {
    console.error('Error generating 3D image:', error);
    throw error;
  }
};

// Get ingredient suggestions
export const getSuggestedIngredients = async (
  dish_name: string, 
  current_ingredients: string[]
): Promise<string[]> => {
  try {
    const response = await apiClient.post<{ suggestions: string[] }>('/suggest_ingredients', {
      dish_name,
      current_ingredients
    });
    return response.data.suggestions;
  } catch (error) {
    console.error('Error getting ingredient suggestions:', error);
    throw error;
  }
};

// Generate dish description
export const generateDescription = async (
  dish_name: string,
  ingredients: string[]
): Promise<string> => {
  try {
    const response = await apiClient.post<{ description: string }>('/generate_description', {
      dish_name,
      ingredients
    });
    return response.data.description;
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
};

// Get all dishes
export const getAllDishes = async (): Promise<Dish[]> => {
  try {
    const response = await apiClient.get<Dish[]>('/dishes');
    return response.data;
  } catch (error) {
    console.error('Error fetching dishes:', error);
    throw error;
  }
};

// Get a single dish
export const getDish = async (id: string): Promise<Dish> => {
  try {
    const response = await apiClient.get<Dish>(`/dishes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching dish ${id}:`, error);
    throw error;
  }
};

// Create a new dish
export const createDish = async (dish: Omit<Dish, 'id'>): Promise<Dish> => {
  try {
    const response = await apiClient.post<Dish>('/dishes', dish);
    return response.data;
  } catch (error) {
    console.error('Error creating dish:', error);
    throw error;
  }
};

// Update a dish
export const updateDish = async (id: string, dish: Partial<Dish>): Promise<Dish> => {
  try {
    const response = await apiClient.put<Dish>(`/dishes/${id}`, dish);
    return response.data;
  } catch (error) {
    console.error(`Error updating dish ${id}:`, error);
    throw error;
  }
};

// Delete a dish
export const deleteDish = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/dishes/${id}`);
  } catch (error) {
    console.error(`Error deleting dish ${id}:`, error);
    throw error;
  }
};

// Get all ingredients
export const getAllIngredients = async (): Promise<Ingredient[]> => {
  try {
    const response = await apiClient.get<Ingredient[]>('/ingredients');
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

// Get dish-ingredient relationships
export const getDishIngredients = async (): Promise<DishIngredient[]> => {
  try {
    const response = await apiClient.get<DishIngredient[]>('/dish_ingredients');
    return response.data;
  } catch (error) {
    console.error('Error fetching dish ingredients:', error);
    throw error;
  }
};
