
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Toaster as UIToaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Customers from "@/pages/Customers";
import Reports from "@/pages/Reports";
import TableManagement from "@/pages/TableManagement";
import RestaurantMapPage from "@/pages/RestaurantMapPage";
import POS from "@/pages/POS";
import KitchenDisplay from "@/pages/KitchenDisplay";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import DishManagement from "@/pages/DishManagement";
import "@/App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/tables" element={<TableManagement />} />
        <Route path="/restaurant-map" element={<RestaurantMapPage />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/kitchen" element={<KitchenDisplay />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/dishes" element={<DishManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
      <UIToaster />
    </Router>
  );
};

export default App;
