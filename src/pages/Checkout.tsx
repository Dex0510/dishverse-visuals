
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

// Simulated Razorpay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'cod') {
        // Simulate processing for Cash on Delivery
        setTimeout(() => {
          clearCart();
          toast.success('Order placed successfully! You will pay on delivery.');
          navigate('/order-confirmation');
        }, 1500);
      } else {
        // Simulate Razorpay integration
        // In a real app, you would call your backend to create a Razorpay order first
        setTimeout(() => {
          // Simulate a successful payment without actually loading Razorpay
          clearCart();
          toast.success('Payment completed and order placed successfully!');
          navigate('/order-confirmation');
        }, 1500);
        
        // Actual Razorpay integration would look like this:
        /*
        // First call your backend to create an order
        const response = await fetch('/api/create_payment_order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(total * 100), // convert to paise
            receipt: `order_rcpt_${Date.now()}`
          })
        });
        
        const orderData = await response.json();
        
        // Then initialize Razorpay
        const options = {
          key: "YOUR_RAZORPAY_KEY_ID",
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Restaurant Name",
          description: "Food Order Payment",
          order_id: orderData.razorpay_order_id,
          handler: function (response: any) {
            // On successful payment
            clearCart();
            toast.success('Payment completed successfully!');
            navigate('/order-confirmation');
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          notes: {
            address: formData.address
          },
          theme: {
            color: "#3399cc"
          }
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        */
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment process failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to your cart before checking out.</p>
          <Button onClick={() => navigate('/')}>
            Return to Menu
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-card p-6 rounded-lg space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea 
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <RadioGroup 
                    defaultValue="online" 
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="cursor-pointer flex-grow">Online Payment (Card/UPI)</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer flex-grow">Cash On Delivery (COD)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="md:col-span-1">
              <div className="glass-card p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm pb-2 border-b">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground"> × {item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-base pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
