
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChefHat, ShoppingCart, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary transition-opacity duration-200 hover:opacity-80"
          >
            <ChefHat size={32} strokeWidth={1.5} />
            <span className="text-xl font-medium tracking-tight">DishVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-foreground/80 hover:text-primary transition-colors duration-200 ${
                location.pathname === "/" && "text-primary font-medium"
              }`}
            >
              Menu
            </Link>
            <Link
              to="/dashboard"
              className={`text-foreground/80 hover:text-primary transition-colors duration-200 ${
                location.pathname.includes("/dashboard") && "text-primary font-medium"
              }`}
            >
              <span className="flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </span>
            </Link>
            <CartButton onClick={() => setShowCartDrawer(true)} />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <CartButton onClick={() => setShowCartDrawer(true)} />
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="glass-card animate-fade-in px-6 py-6 flex flex-col space-y-4">
            <Link
              to="/"
              className={`text-foreground/80 hover:text-primary py-2 transition-colors duration-200 ${
                location.pathname === "/" && "text-primary font-medium"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/dashboard"
              className={`text-foreground/80 hover:text-primary py-2 transition-colors duration-200 ${
                location.pathname.includes("/dashboard") && "text-primary font-medium"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={showCartDrawer} 
        onClose={() => setShowCartDrawer(false)} 
      />
    </header>
  );
};

export default Navbar;
