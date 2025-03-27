
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
