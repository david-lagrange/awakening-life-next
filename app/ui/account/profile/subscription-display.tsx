'use client';

import { useRouter } from 'next/navigation';
import { SubscriptionPlan, UserSubscriptionDetails, cancelCurrentSubscription, reactivateCurrentSubscription, toggleSubscriptionAutoRenewal } from '@/app/lib/actions/subscription/subscription-actions';
import { 
  CreditCardIcon, 
  CheckCircleIcon,
  ArrowPathIcon,
  XCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

interface SubscriptionDisplayProps {
  plans: SubscriptionPlan[];
  userSubscriptions: UserSubscriptionDetails[];
}

export default function SubscriptionDisplay({ 
  plans, 
  userSubscriptions 
}: SubscriptionDisplayProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentActivePlan = plans.find(plan => plan.productId === userSubscriptions?.find(subscription => subscription.status === 'active')?.productId);

  const currentActiveSubscription = userSubscriptions?.find(subscription => subscription.status === 'active');
  const currentTrialingSubscription = userSubscriptions?.find(subscription => subscription.status === 'trialing');
  const freeSubscription = userSubscriptions?.find(subscription => subscription.productName === 'free');
  
  const subscriptionToActOn = currentTrialingSubscription || currentActiveSubscription;

  const handleAutoRenewalToggle = async () => {
    if (!subscriptionToActOn?.subscriptionId || isUpdating) return;

    setIsUpdating(true);
    try {
      const result = await toggleSubscriptionAutoRenewal(
        subscriptionToActOn.subscriptionId, 
        subscriptionToActOn.autoRenew
      );
      if (result.success) {
        router.refresh(); // Refresh the page to show updated subscription status
      } else {
        console.error('Failed to toggle auto-renewal:', result.error);
        // Optionally show an error toast/message here
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubscriptionAction = async () => {
    if (!subscriptionToActOn?.subscriptionId || isProcessing) return;
    if (!currentActiveSubscription?.subscriptionId) return;

    setIsProcessing(true);
    try {
      const result = subscriptionToActOn.isCanceled
        ? await reactivateCurrentSubscription(subscriptionToActOn.subscriptionId)
        : await cancelCurrentSubscription(currentActiveSubscription.subscriptionId);

      if (result.success) {
        router.refresh();
      } else {
        console.error('Failed to process subscription action:', result.error);
        // Optionally show an error toast/message here
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700" aria-labelledby="subscription-heading">
      {!subscriptionToActOn ? (
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-400 text-sm font-medium">
            You currently don&apos;t have an active subscription. Choose a subscription plan to get started.
          </p>
        </div>
      ) : currentTrialingSubscription ? (
        <div className="mb-6 p-4 bg-amber-100 dark:bg-yellow-900/20 border border-amber-300 dark:border-yellow-800 rounded-lg">
          <p className="text-amber-800 dark:text-yellow-400 text-sm font-medium">
            Your subscription will change to {plans.find(p => p.productId === currentTrialingSubscription.productId)?.name} on {format(new Date(currentActiveSubscription?.currentPeriodEnd || ''), 'PPP')}.
          </p>
        </div>
      ) : subscriptionToActOn.isCanceled && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-400 text-sm font-medium">
            {freeSubscription 
              ? `Your subscription has been canceled. Your account will automatically switch to the free plan on ${format(new Date(subscriptionToActOn.currentPeriodEnd), 'PPP')}.`
              : `Your subscription has been canceled and will end on ${format(new Date(subscriptionToActOn.currentPeriodEnd), 'PPP')}.`
            }
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
            <CreditCardIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h2 id="subscription-heading" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Current Subscription</h2>
        </div>
        
        {subscriptionToActOn && (
          <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium
            ${subscriptionToActOn?.isCanceled
              ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-800'
              : currentTrialingSubscription
                ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                : subscriptionToActOn?.status === 'active'
                  ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border border-gray-300 dark:border-gray-700'}`}>
            <div className={`w-2 h-2 rounded-full mr-1.5
              ${subscriptionToActOn?.isCanceled
                ? 'bg-red-600 dark:bg-red-400'
                : currentTrialingSubscription
                  ? 'bg-amber-600 dark:bg-amber-400'
                  : subscriptionToActOn?.status === 'active'
                    ? 'bg-emerald-600 dark:bg-emerald-400' 
                    : 'bg-gray-600 dark:bg-gray-400'}`}>
            </div>
            {subscriptionToActOn?.isCanceled 
              ? 'Canceled' 
              : currentTrialingSubscription
                ? 'Changing Soon'
                : subscriptionToActOn?.status === 'active' 
                  ? 'Active' 
                  : 'Inactive'}
          </div>
        )}
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700">
        {!subscriptionToActOn ? (
          <div className="flex items-center">
            <XCircleIcon className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No current subscription</h3>
          </div>
        ) : (
          <div className="flex items-center mb-5">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30">
              <CheckCircleIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">{currentActivePlan?.name || 'Free'}</h3>
          </div>
        )}
        
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          {subscriptionToActOn && (
            <div className="flex items-baseline">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2 font-medium">Price:</span>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                ${(currentActivePlan?.price || 0) / 100}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">/{currentActivePlan?.interval || 'month'}</span>
            </div>
          )}
          
          {currentActivePlan?.features && (
            <div className="mt-5 pt-5 border-t border-gray-300 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-3">Included Features:</p>
              <ul className="grid grid-cols-1 gap-2.5">
                {currentActivePlan.features.map((feature) => (
                  <li key={feature.subscriptionFeatureId} className="flex items-center text-sm">
                    <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full ${
                      feature.isIncluded 
                        ? 'bg-green-200 dark:bg-green-900/30' 
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}>
                      {feature.isIncluded ? (
                        <CheckCircleIcon className="w-3.5 h-3.5 text-green-700 dark:text-green-400" />
                      ) : (
                        <XCircleIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <span className="ml-2.5 text-gray-800 dark:text-gray-300">{feature.featureText}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {subscriptionToActOn && (
          <div className="mt-5 pt-5 border-t border-gray-300 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full ${
                  subscriptionToActOn.autoRenew 
                    ? 'bg-green-200 dark:bg-green-900/30' 
                    : 'bg-gray-200 dark:bg-gray-800'
                }`}>
                  <ArrowPathIcon className={`w-3 h-3 ${
                    subscriptionToActOn.autoRenew 
                      ? 'text-green-700 dark:text-green-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <span className="ml-2.5 text-sm text-gray-800 dark:text-gray-300">
                  Auto-renew is <span className={subscriptionToActOn.autoRenew 
                    ? 'text-green-700 dark:text-green-400 font-medium' 
                    : 'text-gray-600 dark:text-gray-400'
                  }>{subscriptionToActOn.autoRenew ? 'enabled' : 'disabled'}</span>
                </span>
              </div>
              
              {subscriptionToActOn.autoRenew && (
                <div className="flex items-start ml-7.5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30">
                      <CalendarIcon className="w-3 h-3 text-blue-700 dark:text-blue-400" />
                    </div>
                    <div className="ml-2.5">
                      <p className="text-sm text-gray-800 dark:text-gray-300">
                        Next renewal: <span className="font-medium">{format(new Date(subscriptionToActOn.currentPeriodEnd), 'PPP')}</span>
                      </p>
                      {currentTrialingSubscription && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          (for {plans.find(p => p.productId === currentTrialingSubscription.productId)?.name} subscription)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-col space-y-3">
          {subscriptionToActOn && (subscriptionToActOn.status === 'active' || subscriptionToActOn.status === 'trialing') && (
            <>
              <button
                onClick={handleAutoRenewalToggle}
                disabled={isUpdating || currentActivePlan?.name === 'Free' || subscriptionToActOn?.isCanceled}
                className="flex items-center justify-center px-4 py-2.5 text-sm font-medium 
                  transition-colors rounded-md border border-amber-300 dark:border-gray-700
                  text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                  dark:disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                {isUpdating ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                )}
                <span>
                  {subscriptionToActOn?.autoRenew ? 'Turn Off' : 'Turn On'} Auto-Renewal
                </span>
              </button>
              
              <button
                onClick={handleSubscriptionAction}
                disabled={isProcessing || currentActivePlan?.name === 'Free'}
                className="flex items-center justify-center px-4 py-2.5 text-sm font-medium 
                  transition-colors rounded-md border border-red-300 dark:border-gray-700
                  text-red-800 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                  dark:disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/40"
              >
                {isProcessing ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <XCircleIcon className="w-4 h-4 mr-2" />
                )}
                <span>
                  {subscriptionToActOn?.isCanceled ? 'Reactivate' : 'Cancel'} Subscription
                </span>
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/account/billing"
            className="flex items-center justify-center px-4 py-2.5 text-sm font-medium 
              transition-colors rounded-md bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 
              focus:ring-blue-500/40"
          >
            <CreditCardIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-center">Billing & Payments</span>
          </Link>

          <Link
            href="/account/manage-subscription"
            className="flex items-center justify-center px-4 py-2.5 text-sm font-medium 
              transition-colors rounded-md bg-blue-100 dark:bg-blue-900/20
              border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-400
              hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
              focus:ring-blue-500/40"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-center">
              {!subscriptionToActOn ? 'Choose Subscription' : 'Change Subscription'}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
} 