'use client';

import { useState } from 'react';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { PaymentMethod } from '@/app/lib/actions/subscription/subscription-actions';
import { CardIcon } from '@/app/ui/account/billing/payment-methods/card-icon';
import AddPaymentMethod from '@/app/ui/account/billing/payment-methods/add-payment-method';
import { fetchCustomerPaymentMethods } from '@/app/lib/actions/subscription/subscription-actions';

interface PaymentMethodSelectionProps {
  paymentMethods?: PaymentMethod[];
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
}

export default function PaymentMethodSelection({
  paymentMethods,
  onPaymentMethodSelected,
  onBack,
}: PaymentMethodSelectionProps) {
  const [showAddNew, setShowAddNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (showAddNew) {
    return (
      <div className="p-0">
        <button
          onClick={() => setShowAddNew(false)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 
            dark:text-gray-400 dark:hover:text-gray-200 mb-6"
          aria-label="Back to saved payment methods"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          Back to saved payment methods
        </button>
        {isLoading ? (
          <div className="flex items-center justify-center py-8" aria-live="polite" aria-busy="true">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" aria-hidden="true"></div>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <AddPaymentMethod
            returnUrl={null}
            onSuccess={async (newPaymentMethodId) => {
              if (!newPaymentMethodId) return;
              
              setIsLoading(true);
              try {
                const newMethod = await fetchOrRetrievePaymentMethodById(newPaymentMethodId);
                onPaymentMethodSelected(newMethod);
              } catch (error) {
                console.error('Error fetching new payment method:', error);
                // Optionally show an error message to the user
              } finally {
                setIsLoading(false);
                setShowAddNew(false);
              }
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowAddNew(true)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium 
            text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300
            border border-blue-300 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/20
            hover:bg-blue-200 dark:hover:bg-blue-900/30 rounded-md transition-colors"
          aria-label="Add new payment method"
        >
          <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          Add New
        </button>
      </div>

      <div className="space-y-4" role="radiogroup" aria-label="Select a payment method">
        {paymentMethods?.map((method) => (
          <button
            key={method.paymentMethodId}
            className="w-full text-left p-4 rounded-lg border border-gray-300 
              dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 
              transition-colors duration-200"
            onClick={() => onPaymentMethodSelected(method)}
            role="radio"
            aria-checked="false"
            aria-label={`${method.brand} card ending in ${method.last4}, expires ${method.expMonth.toString().padStart(2, '0')}/${method.expYear}`}
          >
            <div className="flex items-center space-x-4">
              <CardIcon
                brand={method.brand}
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                aria-hidden="true"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {method.brand} •••• {method.last4}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                </p>
              </div>
            </div>
          </button>
        ))}

        {(!paymentMethods || paymentMethods.length === 0) && (
          <div className="text-center py-6" aria-live="polite">
            <p className="text-gray-500 dark:text-gray-400">
              No payment methods found. Please add a new one.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-6 w-full flex items-center justify-center px-4 py-2.5 
          text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-100 
          dark:bg-gray-800 border border-gray-300 dark:border-gray-700
          hover:bg-gray-200 dark:hover:bg-gray-700 
          rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        aria-label="Back to order details"
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" aria-hidden="true" />
        Back to Order Details
      </button>
    </div>
  );
}

async function fetchOrRetrievePaymentMethodById(id: string): Promise<PaymentMethod> {
  const { paymentMethods, error } = await fetchCustomerPaymentMethods();
  
  if (error) {
    throw new Error(error);
  }
  
  const paymentMethod = paymentMethods?.find(method => method.paymentMethodId === id);
  if (!paymentMethod) {
    throw new Error('Payment method not found');
  }
  
  return paymentMethod;
} 