import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Shield } from 'lucide-react';

// Initialize Stripe outside of component to avoid recreating the object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_YOUR_STRIPE_TEST_KEY');

const CheckoutForm = ({ budgetAmount, onSuccess, onCancel, isSubmittingTask }: { budgetAmount: number, onSuccess: (paymentIntentId: string) => void, onCancel: () => void, isSubmittingTask: boolean }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || isSubmittingTask) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('tasklink_token');
      // 1. Fetch PaymentIntent client secret from backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://tasklink.test/api'}/payment/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ budget: budgetAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize payment.');
      }

      const { client_secret, payment_intent_id } = await response.json();

      // 2. Confirm card payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found.");

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'TaskLink Customer',
            address: {
              line1: '123 Main Street',
              city: 'Colombo',
              postal_code: '00100',
              country: 'LK',
            },
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || 'Payment failed.');
      } else if (result.paymentIntent?.status === 'succeeded') {
        // 3. Payment succeeded, call onSuccess to save the task
        onSuccess(payment_intent_id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Card Details</label>
        <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </div>
        {errorMessage && (
          <div className="mt-3 text-sm text-red-600 font-medium">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={!stripe || isProcessing || isSubmittingTask}
          className={`w-full py-4 text-white font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer ${isProcessing || isSubmittingTask ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}`}
        >
          {isProcessing || isSubmittingTask ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Shield className="w-5 h-5" />
          )}
          {isProcessing ? 'Processing...' : isSubmittingTask ? 'Creating Task...' : `Authorize & Reserve LKR ${budgetAmount.toLocaleString()}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing || isSubmittingTask}
          className="w-full py-4 text-slate-600 font-bold text-base rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
        >
          Cancel Booking
        </button>
      </div>
      
      <div className="flex items-center justify-center gap-2 mt-4 opacity-50">
        <Shield className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-400">Payments are secured and encrypted by Stripe</span>
      </div>
    </form>
  );
};

export const StripePaymentForm = ({ budgetAmount, onSuccess, onCancel, isSubmittingTask }: { budgetAmount: number, onSuccess: (paymentIntentId: string) => void, onCancel: () => void, isSubmittingTask: boolean }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm budgetAmount={budgetAmount} onSuccess={onSuccess} onCancel={onCancel} isSubmittingTask={isSubmittingTask} />
    </Elements>
  );
};
