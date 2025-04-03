
import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Mock data
const mockTables = [
  { id: "1", name: "Table 1", capacity: 4, status: "available", section: "main" },
  { id: "2", name: "Table 2", capacity: 2, status: "occupied", section: "main" },
  { id: "3", name: "Table 3", capacity: 6, status: "available", section: "main" },
  { id: "4", name: "Table 4", capacity: 4, status: "reserved", section: "main" },
  { id: "5", name: "Table 5", capacity: 4, status: "available", section: "outdoor" },
  { id: "6", name: "Table 6", capacity: 4, status: "cleaning", section: "outdoor" },
  { id: "7", name: "Table 7", capacity: 8, status: "available", section: "private" },
  { id: "8", name: "Table 8", capacity: 4, status: "reserved", section: "private" },
];

const mockSections = [
  {
    id: "main",
    name: "Main Floor",
    capacity: 40,
    tables: mockTables.filter(table => table.section === "main"),
  },
  {
    id: "outdoor",
    name: "Outdoor Patio",
    capacity: 20,
    tables: mockTables.filter(table => table.section === "outdoor"),
  },
  {
    id: "private",
    name: "Private Room",
    capacity: 12,
    tables: mockTables.filter(table => table.section === "private"),
  },
];

// Mock ingredients database
const mockIngredients = [
  { id: "1", name: "Chicken", category: "Protein", unitOfMeasure: "kg", inStock: 25 },
  { id: "2", name: "Beef", category: "Protein", unitOfMeasure: "kg", inStock: 20 },
  { id: "3", name: "Salmon", category: "Protein", unitOfMeasure: "kg", inStock: 15 },
  { id: "4", name: "Lettuce", category: "Vegetable", unitOfMeasure: "kg", inStock: 10 },
  { id: "5", name: "Tomato", category: "Vegetable", unitOfMeasure: "kg", inStock: 12 },
  { id: "6", name: "Onion", category: "Vegetable", unitOfMeasure: "kg", inStock: 8 },
  { id: "7", name: "Garlic", category: "Spice", unitOfMeasure: "kg", inStock: 5 },
  { id: "8", name: "Salt", category: "Spice", unitOfMeasure: "kg", inStock: 7 },
  { id: "9", name: "Pepper", category: "Spice", unitOfMeasure: "kg", inStock: 6 },
  { id: "10", name: "Flour", category: "Dry Goods", unitOfMeasure: "kg", inStock: 15 },
  { id: "11", name: "Sugar", category: "Dry Goods", unitOfMeasure: "kg", inStock: 12 },
  { id: "12", name: "Rice", category: "Grain", unitOfMeasure: "kg", inStock: 20 },
  { id: "13", name: "Pasta", category: "Grain", unitOfMeasure: "kg", inStock: 18 },
  { id: "14", name: "Olive Oil", category: "Oil", unitOfMeasure: "l", inStock: 10 },
  { id: "15", name: "Red Wine", category: "Alcohol", unitOfMeasure: "l", inStock: 5 },
];

// Mock dishes database
const mockDishes = [
  {
    id: "1",
    name: "Seared Salmon",
    description: "Fresh Atlantic salmon seared to perfection, served with lemon-herb butter, roasted asparagus, and wild rice pilaf.",
    price: 22.99,
    category: "Main Course",
    ingredients: ["Salmon", "Lemon", "Herbs", "Asparagus", "Wild Rice"],
    imageUrl: null,
    isAvailable: true
  },
  {
    id: "2",
    name: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with a molten center, served with vanilla bean ice cream and fresh berries.",
    price: 8.99,
    category: "Dessert",
    ingredients: ["Chocolate", "Flour", "Sugar", "Eggs", "Vanilla Ice Cream", "Berries"],
    imageUrl: null,
    isAvailable: true
  },
  {
    id: "3",
    name: "Garlic Truffle Fries",
    description: "Crispy golden fries tossed with garlic, truffle oil, and Parmesan cheese, served with aioli dipping sauce.",
    price: 6.99,
    category: "Appetizer",
    ingredients: ["Potatoes", "Garlic", "Truffle Oil", "Parmesan", "Aioli"],
    imageUrl: null,
    isAvailable: true
  },
  {
    id: "4",
    name: "Caprese Salad",
    description: "Fresh tomatoes, mozzarella, and basil drizzled with balsamic reduction and olive oil.",
    price: 9.99,
    category: "Appetizer",
    ingredients: ["Tomatoes", "Mozzarella", "Basil", "Balsamic", "Olive Oil"],
    imageUrl: null,
    isAvailable: true
  },
  {
    id: "5",
    name: "Vegetable Soup",
    description: "Hearty vegetable soup with seasonal vegetables and herbs.",
    price: 5.99,
    category: "Soup",
    ingredients: ["Carrots", "Celery", "Onion", "Potato", "Herbs"],
    imageUrl: null,
    isAvailable: true
  },
  {
    id: "6",
    name: "Beef Wellington",
    description: "Tender filet mignon wrapped in puff pastry with mushroom duxelles.",
    price: 32.99,
    category: "Main Course",
    ingredients: ["Beef", "Pastry", "Mushrooms", "Thyme", "Mustard"],
    imageUrl: null,
    isAvailable: true
  }
];

// Mock dish-ingredient relationships (like a junction table in a real database)
const mockDishIngredients = [
  { dishId: "1", ingredientId: "3", quantity: 0.25, units: "kg" },
  { dishId: "1", ingredientId: "7", quantity: 0.01, units: "kg" },
  { dishId: "1", ingredientId: "8", quantity: 0.005, units: "kg" },
  { dishId: "1", ingredientId: "9", quantity: 0.003, units: "kg" },
  { dishId: "1", ingredientId: "12", quantity: 0.1, units: "kg" },
  
  { dishId: "2", ingredientId: "10", quantity: 0.15, units: "kg" },
  { dishId: "2", ingredientId: "11", quantity: 0.1, units: "kg" },
  
  { dishId: "3", ingredientId: "6", quantity: 0.05, units: "kg" },
  { dishId: "3", ingredientId: "7", quantity: 0.01, units: "kg" },
  { dishId: "3", ingredientId: "14", quantity: 0.03, units: "l" },
];

// Mock API handlers
const mockHandlers: Record<string, (config: any) => AxiosResponse<any>> = {
  'GET /tables': () => ({ 
    data: mockTables,
    status: 200, 
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }),
  'GET /sections': () => ({ 
    data: mockSections,
    status: 200, 
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }),
  'GET /ingredients': () => ({
    data: mockIngredients,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }),
  'GET /dishes': () => ({
    data: mockDishes,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }),
  'GET /dish_ingredients': () => ({
    data: mockDishIngredients,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }),
  'POST /process_dish': (config) => {
    const { dish_name, ingredients, description } = JSON.parse(config.data);
    return {
      data: {
        image_url: `https://placehold.co/600x400/orange/white?text=${encodeURIComponent(dish_name)}`,
        suggested_ingredients: ["Garlic", "Olive Oil", "Black Pepper", "Sea Salt", "Fresh Herbs"].filter(
          ing => !ingredients.includes(ing)
        ).slice(0, 3),
        description: description || `Delicious ${dish_name} prepared with ${ingredients.join(", ")}. A perfect meal for any occasion.`,
        recommended_dish: `${dish_name} with seasonal vegetables`
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };
  },
  'POST /suggest_ingredients': (config) => {
    const { dish_name, current_ingredients } = JSON.parse(config.data);
    // Suggest ingredients not already in current_ingredients
    const possibleSuggestions = mockIngredients
      .filter(ing => !current_ingredients.includes(ing.name))
      .map(ing => ing.name);
      
    // Randomly select 3-5 ingredients
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const suggestions = [];
    
    for (let i = 0; i < count && possibleSuggestions.length > 0; i++) {
      const index = Math.floor(Math.random() * possibleSuggestions.length);
      suggestions.push(possibleSuggestions[index]);
      possibleSuggestions.splice(index, 1);
    }
    
    return {
      data: { suggestions },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };
  },
  'POST /generate_description': (config) => {
    const { dish_name, ingredients } = JSON.parse(config.data);
    const description = `Our ${dish_name} features ${ingredients.slice(0, 3).join(', ')}${ingredients.length > 3 ? ' and more' : ''}, 
      prepared by our expert chefs to create a perfectly balanced flavor profile. 
      Each ingredient is carefully selected to ensure the highest quality and taste.`;
    
    return {
      data: { description },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };
  },
  'POST /generate_3d_image': (config) => {
    const { dish_name } = JSON.parse(config.data);
    // In a real app, this would call an actual image generation API
    const image_url = `https://placehold.co/600x400/orange/white?text=${encodeURIComponent(dish_name)}`;
    
    return {
      data: { image_url },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };
  },
};

export const setupMockMiddleware = (apiClient: AxiosInstance): void => {
  // Add request interceptor for mock handling
  apiClient.interceptors.request.use(
    async (config) => {
      const useMock = !config.url?.includes('api.') && !config.url?.includes('http');
      
      if (useMock && config.url) {
        const mockKey = `${config.method?.toUpperCase()} ${config.url}`;
        
        // Check if we have a mock handler for this request
        if (mockHandlers[mockKey]) {
          // Cancel the real request
          config.adapter = () => {
            return new Promise(resolve => {
              const mockResponse = mockHandlers[mockKey](config);
              console.log(`[Mock API] ${mockKey}`, mockResponse.data);
              resolve(mockResponse);
            });
          };
        } else {
          console.warn(`[Mock API] No handler for ${mockKey}`);
        }
      }
      
      return config;
    },
    error => Promise.reject(error)
  );
};

export default setupMockMiddleware;
