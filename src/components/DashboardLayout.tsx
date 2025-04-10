
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, Bell, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/DashboardSidebar";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";

const DashboardLayout = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, shown on toggle */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:relative md:z-0 w-64
        transform transition-transform duration-300 ease-in-out
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-background border-b py-3 px-4 sm:px-6 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2" 
            onClick={() => setShowMobileSidebar(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-medium">Restaurant Management</h1>
          
          <div className="ml-auto flex items-center gap-2">
            {user && (
              <span className="text-sm mr-2">
                Welcome, {user.name}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setShowCartDrawer(true)}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </div>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Main content area - Outlet renders the child route components */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={showCartDrawer} 
        onClose={() => setShowCartDrawer(false)} 
      />
    </div>
  );
};

export default DashboardLayout;
