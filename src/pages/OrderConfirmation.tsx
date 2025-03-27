
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-lg mx-auto text-center glass-card p-12 rounded-xl">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-24 w-24 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We've received your payment and are preparing your food.
          </p>
          
          <div className="bg-secondary/50 p-4 rounded-lg mb-8">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-xl font-semibold">{orderNumber}</p>
          </div>
          
          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email has been sent to your email address with all order details.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button onClick={() => navigate('/')}>
              Return to Menu
            </Button>
            <Button variant="outline" onClick={() => navigate('/orders')}>
              View Order History
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
