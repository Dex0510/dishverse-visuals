
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

// Define a simple User type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define the Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

// AuthProvider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Simple login function that accepts any credentials
  const login = async (email: string, password: string): Promise<boolean> => {
    // Create a mock user with whatever was entered
    const mockUser: User = {
      id: "user-1",
      email: email || "guest@example.com",
      name: email ? email.split("@")[0] : "Guest User",
      role: "admin"
    };
    
    // Set user state
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
