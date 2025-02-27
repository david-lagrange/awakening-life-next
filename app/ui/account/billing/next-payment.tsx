'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';
import { UserSubscriptionDetails } from '@/app/lib/actions/subscription/subscription-actions';
import { format } from 'date-fns';

interface NextPaymentProps {
  subscription: UserSubscriptionDetails | null;
}

export default function NextPayment({ subscription }: NextPaymentProps) {
  if (!subscription || !subscription.autoRenew) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" aria-labelledby="next-payment-heading">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
            <CalendarIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h2 id="next-payment-heading" className="text-lg font-semibold text-gray-900 dark:text-white">Next Payment</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Auto-renewal is disabled</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" aria-labelledby="next-payment-heading">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <CalendarIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
        </div>
        <h2 id="next-payment-heading" className="text-lg font-semibold text-gray-900 dark:text-white">Next Payment</h2>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          ${(subscription.productCurrentDefaultPrice / 100).toFixed(2)}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Due on <time dateTime={subscription.currentPeriodEnd}>{format(new Date(subscription.currentPeriodEnd), 'PPP')}</time>
        </p>
      </div>
    </div>
  );
} 