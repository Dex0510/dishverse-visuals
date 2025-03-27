
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  ingredients: string[];
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
};

const initialState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
};

// Try to load cart from localStorage on initialization
const loadInitialState = (): CartState => {
  if (typeof window === "undefined") return initialState;

  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
      return {
        ...parsedCart,
        ...calculateCartTotals(parsedCart.items),
      };
    } catch (e) {
      console.error("Failed to parse saved cart", e);
    }
  }
  return initialState;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
      } else {
        // Add new item
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      newState = {
        items: newItems,
        ...calculateCartTotals(newItems),
      };
      break;
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      newState = {
        items: newItems,
        ...calculateCartTotals(newItems),
      };
      break;
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter((item) => item.id !== id);
        newState = {
          items: newItems,
          ...calculateCartTotals(newItems),
        };
      } else {
        // Update quantity
        const newItems = state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        newState = {
          items: newItems,
          ...calculateCartTotals(newItems),
        };
      }
      break;
    }

    case "CLEAR_CART": {
      newState = initialState;
      break;
    }

    default:
      return state;
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(newState));
  
  return newState;
};

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, null, loadInitialState);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } });
    toast.success(`Added ${item.name} to cart`);
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    toast.info("Item removed from cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.info("Cart cleared");
  };

  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
