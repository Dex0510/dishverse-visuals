
import React from 'react';
import { X, ShoppingCart, Trash, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, tax, total, removeItem, updateQuantity, clearCart, itemCount } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };
  
  return (
    <div 
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-background shadow-xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" /> Your Cart 
            {itemCount > 0 && <span className="ml-2 text-sm text-muted-foreground">({itemCount} items)</span>}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-grow overflow-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
              <p>Your cart is empty</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                      {item.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-3">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <div className="ml-auto font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <Button 
                  variant="outline" 
                  className="text-sm"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
