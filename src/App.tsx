
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Outlet,
  Navigate
} from "react-router-dom";
import { Toaster } from "sonner";

import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import DishManagement from "./pages/DishManagement";
import TableManagement from "./pages/TableManagement";
import KitchenDisplay from "./pages/KitchenDisplay";
import Reports from "./pages/Reports";
import VoiceAssistant from "./pages/VoiceAssistant";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import RestaurantMap from "./components/FloorMap/RestaurantMap";
import WaitlistManagement from "@/pages/WaitlistManagement";
import RestaurantMapPage from "./pages/RestaurantMapPage";
import DashboardLayout from "./components/DashboardLayout";
import Rewards from "./pages/Rewards";

// Improved ProtectedRoute that redirects to signin if not authenticated
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return <Outlet />;
};

// App component separated from authentication logic
const AppContent = () => {
  return (
    <>
      <Toaster />
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            
            {/* Protected dashboard routes wrapped in DashboardLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/dish-management" element={<DishManagement />} />
                <Route path="/tables" element={<TableManagement />} />
                <Route path="/waitlist" element={<WaitlistManagement />} />
                <Route path="/kitchen-display" element={<KitchenDisplay />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/voice-assistant" element={<VoiceAssistant />} />
                <Route path="/map" element={<RestaurantMapPage />} />
                <Route path="/rewards" element={<Rewards />} />
              </Route>
            </Route>
            
            {/* Order flow routes */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
};

// Main App component with AuthProvider wrapper
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
