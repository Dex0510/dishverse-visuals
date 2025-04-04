
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Outlet
} from "react-router-dom";
import { Toaster } from "sonner";

import { useAuth } from "./contexts/AuthContext";
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
import DashboardSidebar from "./components/DashboardSidebar";
import Rewards from "./pages/Rewards";

const ProtectedRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  return user ? <Outlet /> : null;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          
          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
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
          
          {/* Order flow routes */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
