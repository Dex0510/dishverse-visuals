
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface CartButtonProps {
  onClick: () => void;
  variant?: "default" | "outline" | "link" | "ghost" | "secondary" | "destructive";
}

const CartButton = ({ onClick, variant = "default" }: CartButtonProps) => {
  const { itemCount } = useCart();
  
  return (
    <Button 
      onClick={onClick} 
      variant={variant} 
      className="relative"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
          {itemCount}
        </div>
      )}
    </Button>
  );
};

export default CartButton;
