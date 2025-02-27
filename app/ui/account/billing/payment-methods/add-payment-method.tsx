'use client';

import { useState, useEffect } from 'react';
import { loadStripe, Appearance } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { initializeSetupIntent, revalidatePaymentMethods, fetchCustomerPaymentMethods, setDefaultPaymentMethod } from '@/app/lib/actions/subscription/subscription-actions';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { StripePaymentElement } from '@stripe/stripe-js';
import { CreditCardIcon, ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/outline';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  onSuccess?: (paymentMethodId?: string) => void;
  returnUrl?: string | null;
}

function PaymentForm({ onSuccess, returnUrl }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: returnUrl || window.location.href,
        },
      });

      if (result.error) {
        setError(result.error.message ?? 'An error occurred');
      } else if (result.setupIntent?.status === 'succeeded') {
        const paymentMethodId = result.setupIntent.payment_method?.toString();
        const paymentElement = elements.getElement(PaymentElement) as StripePaymentElement;
        elements.submit().then(() => paymentElement?.clear());
        
        // Check if this is the first/only payment method and set as default if so
        const { paymentMethods } = await fetchCustomerPaymentMethods();

        if (paymentMethodId && paymentMethods) {
          if (paymentMethods.length === 0 || 
              (paymentMethods.length === 1 && paymentMethods[0].paymentMethodId === paymentMethodId)) {
            await setDefaultPaymentMethod(paymentMethodId);
          }
        }

        if (onSuccess) {
          onSuccess(paymentMethodId);
          await revalidatePaymentMethods();
          router.refresh();
        }
      }
    } catch (e) {
      console.error('Error adding payment method:', e);
      setError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-labelledby="payment-form-heading">
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
        <PaymentElement />
      </div>
      
      {error && (
        <div className="p-4 rounded-md" role="alert">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5">
              <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" aria-hidden="true" />
            </div>
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex justify-center items-center py-2.5 px-4 
          border border-blue-300 dark:border-blue-800 text-sm font-medium rounded-md 
          text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20
          hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
          focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed 
          disabled:hover:bg-blue-100 dark:disabled:hover:bg-blue-900/20 transition-colors"
        aria-busy={isProcessing}
      >
        {isProcessing ? (
          <>
            <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
            <span>Processing...</span>
          </>
        ) : (
          'Add Payment Method'
        )}
      </button>
    </form>
  );
}

interface AddPaymentMethodProps {
  onSuccess?: (paymentMethodId?: string) => void;
  returnUrl?: string | null;
}

export default function AddPaymentMethod({ onSuccess, returnUrl }: AddPaymentMethodProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { theme } = useTheme();

  const appearance: Appearance = {
    theme: theme === 'dark' ? 'night' : 'stripe' as const,
    variables: {
      colorPrimary: theme === 'dark' ? '#60A5FA' : '#2563EB',
      colorBackground: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      colorText: theme === 'dark' ? '#F3F4F6' : '#111827',
      colorDanger: theme === 'dark' ? '#EF4444' : '#DC2626',
      fontFamily: '-apple-system, system-ui, sans-serif',
    },
  };

  useEffect(() => {
    async function initialize() {
      try {
        const { clientSecret, error } = await initializeSetupIntent();
        if (error) {
          console.error(error);
          return;
        }
        if (clientSecret) {
          setClientSecret(clientSecret);
        }
      } catch (error) {
        console.error('Error initializing setup intent:', error);
      }
    }

    initialize();
  }, []);

  if (!clientSecret) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6" aria-labelledby="add-payment-method-heading">
        <div className="flex items-center mb-5">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
            <CreditCardIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h2 id="add-payment-method-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Payment Method
          </h2>
        </div>
        
        <div className="animate-pulse space-y-4" aria-label="Loading payment form">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6" aria-labelledby="add-payment-method-heading">
      <div className="flex items-center mb-5">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <CreditCardIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
        </div>
        <h2 id="add-payment-method-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
          Add Payment Method
        </h2>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-5">
        Add a new credit card or debit card to your account. Your payment information is securely processed by Stripe.
      </p>
      
      <Elements 
        stripe={stripePromise} 
        options={{ 
          clientSecret,
          appearance,
        }}
      >
        <PaymentForm onSuccess={onSuccess} returnUrl={returnUrl} />
      </Elements>
    </div>
  );
} 