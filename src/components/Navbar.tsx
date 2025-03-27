
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChefHat } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              className="text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              Menu
            </Link>
            <button className="btn-primary">
              Sign In
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="glass-card animate-fade-in px-6 py-6 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-foreground/80 hover:text-primary py-2 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-foreground/80 hover:text-primary py-2 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <button
              className="btn-primary w-full mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
