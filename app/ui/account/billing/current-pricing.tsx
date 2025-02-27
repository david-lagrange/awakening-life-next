'use client';

import { CreditCardIcon } from '@heroicons/react/24/outline';
import { UserSubscriptionDetails } from '@/app/lib/actions/subscription/subscription-actions';

interface CurrentPricingProps {
  subscription: UserSubscriptionDetails | null;
  changingSoon: boolean;
}

export default function CurrentPricing({ subscription, changingSoon }: CurrentPricingProps) {
  if (!subscription) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" aria-labelledby="current-plan-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
              <CreditCardIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
            </div>
            <h2 id="current-plan-heading" className="text-lg font-semibold text-gray-900 dark:text-white">Current Plan</h2>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            <div className="w-2 h-2 rounded-full mr-1.5 bg-amber-600 dark:bg-amber-400" aria-hidden="true"></div>
            No active subscription
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">No active plan</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" aria-labelledby="current-plan-heading">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
            <CreditCardIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h2 id="current-plan-heading" className="text-lg font-semibold text-gray-900 dark:text-white">Current Plan</h2>
        </div>
        {changingSoon && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800" role="status">
            <div className="w-2 h-2 rounded-full mr-1.5 bg-amber-600 dark:bg-amber-400" aria-hidden="true"></div>
            Changing Soon
          </span>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          ${(subscription.productCurrentDefaultPrice / 100).toFixed(2)}
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            /{subscription.productRecurringInterval}
          </span>
        </p>
        <p className="text-gray-600 dark:text-gray-400">{subscription.productName}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subscription.productDescription}
        </p>
      </div>
    </div>
  );
} 