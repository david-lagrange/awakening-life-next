'use client';

import { CreditCardIcon } from '@heroicons/react/24/outline';
import { PaymentMethod as PaymentMethodType } from '@/app/lib/actions/subscription/subscription-actions';
import { CardIcon } from './payment-methods/card-icon';
import Link from 'next/link';

interface PaymentMethodProps {
  paymentMethod: PaymentMethodType | undefined;
}

export default function PaymentMethod({ paymentMethod }: PaymentMethodProps) {
  if (!paymentMethod) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" aria-labelledby="payment-method-heading">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
            <CreditCardIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h2 id="payment-method-heading" className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">No payment method on file</p>
        <Link
          href="/account/billing/payment-methods"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
        >
          Add a payment method
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" aria-labelledby="payment-method-heading">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <CreditCardIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
        </div>
        <h2 id="payment-method-heading" className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
            <CardIcon 
              brand={paymentMethod.brand} 
              className="h-6 w-6 text-gray-600 dark:text-gray-300" 
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-gray-900 dark:text-gray-100 font-medium capitalize">
              {paymentMethod.brand}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              <span className="sr-only">Card ending in </span>
              •••• {paymentMethod.last4}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Expires <time dateTime={`${paymentMethod.expYear}-${paymentMethod.expMonth.toString().padStart(2, '0')}`}>{paymentMethod.expMonth}/{paymentMethod.expYear}</time>
            </p>
          </div>
        </div>

        <Link
          href="/account/billing/payment-methods"
          className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
        >
          Manage payment methods
        </Link>
      </div>
    </div>
  );
} 