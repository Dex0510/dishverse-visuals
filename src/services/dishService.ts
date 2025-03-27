
import apiClient from './api';

export interface DishRequest {
  dish_name: string;
  ingredients: string[];
  description?: string;
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
