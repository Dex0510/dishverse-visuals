
import apiClient from './api';

export interface CreatePaymentRequest {
  orderId: string;
  amount: number; // in smallest currency unit (e.g., paise for INR)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

// Create a Razorpay payment order
export const createPaymentOrder = async (request: CreatePaymentRequest): Promise<PaymentOrderResponse> => {
  try {
    const response = await apiClient.post<PaymentOrderResponse>('/create_payment_order', request);
    return response.data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

// Verify a payment was successful
export const verifyPayment = async (request: VerifyPaymentRequest): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.post<{ success: boolean }>('/verify_payment', request);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Get payment methods available for the restaurant
export const getPaymentMethods = async (): Promise<Array<{
  id: string;
  name: string;
  type: 'cash' | 'card' | 'upi' | 'online' | 'wallet' | 'credit';
  enabled: boolean;
  icon?: string;
}>> => {
  try {
    const response = await apiClient.get('/payment/methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

// Process a cash payment
export const processCashPayment = async (
  orderId: string,
  amount: number,
  amountTendered: number
): Promise<{
  success: boolean;
  change: number;
  receiptId?: string;
}> => {
  try {
    const response = await apiClient.post(`/payment/cash`, {
      orderId,
      amount,
      amountTendered
    });
    return response.data;
  } catch (error) {
    console.error('Error processing cash payment:', error);
    throw error;
  }
};

// Process a card payment (for in-person transactions via POS)
export const processCardPayment = async (
  orderId: string,
  amount: number,
  cardDetails: {
    last4: string;
    cardType: string;
    authCode?: string;
    terminalId?: string;
  }
): Promise<{
  success: boolean;
  transactionId: string;
  receiptId?: string;
}> => {
  try {
    const response = await apiClient.post(`/payment/card`, {
      orderId,
      amount,
      cardDetails
    });
    return response.data;
  } catch (error) {
    console.error('Error processing card payment:', error);
    throw error;
  }
};

// Process a UPI payment
export const processUpiPayment = async (
  orderId: string,
  amount: number,
  upiDetails: {
    vpa?: string;
    referenceId?: string;
  }
): Promise<{
  success: boolean;
  transactionId: string;
  receiptId?: string;
}> => {
  try {
    const response = await apiClient.post(`/payment/upi`, {
      orderId,
      amount,
      upiDetails
    });
    return response.data;
  } catch (error) {
    console.error('Error processing UPI payment:', error);
    throw error;
  }
};

// Initialize Razorpay for online payment (web/mobile app)
export const initializeOnlinePayment = async (
  orderId: string,
  amount: number,
  currency: string = 'INR'
): Promise<{
  razorpayOrderId: string;
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  orderId: string;
  prefillData?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}> => {
  try {
    const response = await apiClient.post(`/payment/online/initialize`, {
      orderId,
      amount,
      currency
    });
    return response.data;
  } catch (error) {
    console.error('Error initializing online payment:', error);
    throw error;
  }
};

// Process refund
export const processRefund = async (
  orderId: string,
  amount?: number, // If not provided, full refund is processed
  reason?: string
): Promise<{
  success: boolean;
  refundId: string;
  amount: number;
  status: string;
}> => {
  try {
    const response = await apiClient.post(`/payment/refund`, {
      orderId,
      amount,
      reason
    });
    return response.data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};
