
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartButtonProps {
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const { itemCount } = useCart();
  
  return (
    <Button 
      onClick={onClick} 
      variant="outline" 
      size="sm" 
      className="relative"
      aria-label="Shopping Cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-primary text-white">
          {itemCount}
        </span>
      )}
    </Button>
  );
};

export default CartButton;
