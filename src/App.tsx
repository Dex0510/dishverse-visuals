
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { CartProvider } from "./contexts/CartContext";

// Page Components
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import TableManagement from "./pages/TableManagement";
import Inventory from "./pages/Inventory";
import KitchenDisplay from "./pages/KitchenDisplay";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";

// Layout Components
import DashboardLayout from "./components/DashboardLayout";

// Create auth context
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

// Create a protected route component
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const authState = JSON.parse(localStorage.getItem("authState") || "false");
  
  return authState ? element : <Navigate to="/sign-in" />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if user is authenticated on load
  useEffect(() => {
    const authState = localStorage.getItem("authState");
    if (authState) {
      setIsAuthenticated(JSON.parse(authState));
    }
  }, []);
  
  // Mock authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would validate credentials against a backend
    if (email && password) {
      setIsAuthenticated(true);
      localStorage.setItem("authState", "true");
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authState");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" closeButton />
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/sign-in" element={<SignIn />} />
                
                {/* Customer-facing Routes */}
                <Route path="/" element={<ProtectedRoute element={<Index />} />} />
                <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
                <Route path="/order-confirmation" element={<ProtectedRoute element={<OrderConfirmation />} />} />
                
                {/* Admin Dashboard Routes */}
                <Route path="/dashboard" element={<ProtectedRoute element={<DashboardLayout />} />}>
                  <Route index element={<Dashboard />} />
                  <Route path="pos" element={<POS />} />
                  <Route path="tables" element={<TableManagement />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="kitchen" element={<KitchenDisplay />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="customers" element={<Customers />} />
                </Route>
                
                {/* Redirect /pos to /dashboard/pos for convenience */}
                <Route path="/pos" element={<Navigate to="/dashboard/pos" replace />} />
                <Route path="/tables" element={<Navigate to="/dashboard/tables" replace />} />
                <Route path="/inventory" element={<Navigate to="/dashboard/inventory" replace />} />
                <Route path="/kitchen" element={<Navigate to="/dashboard/kitchen" replace />} />
                <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />
                <Route path="/customers" element={<Navigate to="/dashboard/customers" replace />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
