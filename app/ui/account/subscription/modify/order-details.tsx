'use client';

import { ArrowRightIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { 
  UserSubscriptionDetails, 
  SubscriptionPlan 
} from '@/app/lib/actions/subscription/subscription-actions';
import Link from 'next/link';

interface OrderDetailsProps {
  currentSubscription: UserSubscriptionDetails | null;
  selectedPlan: SubscriptionPlan;
  onContinue: () => void;
}

export default function OrderDetails({
  currentSubscription,
  selectedPlan,
  onContinue,
}: OrderDetailsProps) {
  const priceDifference = currentSubscription 
    ? selectedPlan.price - currentSubscription.productCurrentDefaultPrice
    : selectedPlan.price;

  const shouldSkipPayment = selectedPlan.price === 0 || priceDifference <= 0;

  return (
    <div className="p-0">
      {/* <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Order Details
      </h2> */}

      <div className="space-y-6">
        {/* Current Plan */}
        {currentSubscription && (
          <div className="pb-6 border-b border-gray-300 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-3" id="current-plan-heading">
              Current Plan
            </h3>
            <div className="flex justify-between items-center" aria-labelledby="current-plan-heading">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {currentSubscription.productName}
                  </p>
                  {currentSubscription.isCanceled && (
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/20 
                      border border-red-300 dark:border-red-800 text-red-800 dark:text-red-400 rounded-full"
                      aria-label="Canceled">
                      Canceled
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  Billed {currentSubscription.productRecurringInterval}ly
                </p>
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                ${(currentSubscription.productCurrentDefaultPrice / 100).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* New Plan */}
        <div className="pb-6 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-3" id="new-plan-heading">
            New Plan
          </h3>
          <div className="flex justify-between items-center" aria-labelledby="new-plan-heading">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                {selectedPlan.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Billed {selectedPlan.interval}ly
              </p>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">
              ${(selectedPlan.price / 100).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Price Difference */}
        <div className="pb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900 dark:text-white" id="price-difference-heading">
                Price Difference
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5" aria-labelledby="price-difference-heading">
                You will see this {priceDifference > 0 ? 'increase' : 'decrease'} at the beginning of the next billing period
              </p>
            </div>
            <p className={`font-medium ${
              priceDifference > 0 
                ? 'text-emerald-700 dark:text-emerald-400' 
                : 'text-red-700 dark:text-red-400'
            }`} aria-live="polite">
              {priceDifference < 0 ? '- ' : ''}${(Math.abs(priceDifference) / 100).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="pb-6 border-t border-gray-300 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-4" id="features-heading">
            Included Features
          </h3>
          <ul className="space-y-3" aria-labelledby="features-heading">
            {selectedPlan.features.map((feature) => (
              <li 
                key={feature.subscriptionFeatureId}
                className="flex items-center text-sm text-gray-700 dark:text-gray-300"
              >
                <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full mr-2.5 ${
                  feature.isIncluded 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                    : 'bg-gray-100 dark:bg-gray-800'
                }`} aria-hidden="true">
                  {feature.isIncluded ? (
                    <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <XCircleIcon className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <span>
                  {feature.featureText}
                  {!feature.isIncluded && <span className="sr-only"> (not included)</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center px-4 py-2.5 
              text-sm font-medium border border-blue-300 dark:border-blue-800
              text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20
              hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
              focus:ring-blue-500/40 rounded-md transition-colors"
            aria-label={shouldSkipPayment ? 'Continue to confirmation' : 'Continue to payment'}
          >
            {shouldSkipPayment ? 'Continue to Confirmation' : 'Continue to Payment'}
            <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
          </button>

          <Link
            href="/account/manage-subscription"
            className="w-full flex items-center justify-center px-4 py-2.5 
              text-sm font-medium border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 
              focus:ring-gray-500/40 rounded-md transition-colors"
            aria-label="Select another subscription plan"
          >
            Select Another Subscription
          </Link>
        </div>
      </div>
    </div>
  );
} 