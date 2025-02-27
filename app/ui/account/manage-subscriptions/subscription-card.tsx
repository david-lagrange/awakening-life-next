'use client';

import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import type { SubscriptionPlan, UserSubscriptionDetails } from '@/app/lib/actions/subscription/subscription-actions';
import { cancelCurrentSubscription } from '@/app/lib/actions/subscription/subscription-actions';
import Link from 'next/link';
import ConfirmModal from '@/app/ui/common/confirm-modal';
import { useRouter } from 'next/navigation';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: (planId: number) => void;
  isCurrentPlan: boolean;
  userSubscriptions?: UserSubscriptionDetails[];
}

export default function SubscriptionCard({ 
  plan, 
  isSelected, 
  onSelect,
  isCurrentPlan,
  userSubscriptions
}: SubscriptionCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  const activeSubscription = userSubscriptions?.find(sub => sub.status === 'active');
  const trialingSubscription = userSubscriptions?.find(sub => sub.status === 'trialing');

  const subscriptionToActOn = trialingSubscription || activeSubscription;

  const handleCancelSubscription = async () => {
    console.log('userSubscriptions', userSubscriptions);
    if (!activeSubscription) return;
    
    setIsCancelling(true);
    try {
      const result = await cancelCurrentSubscription(activeSubscription.subscriptionId);
      if (!result.success) {
        throw new Error(result.error);
      }
      // Redirect to subscription page or show success message
      // refresh route
      router.refresh();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
    }
  };

  return (
    <div
      className={`
        relative p-6 rounded-xl border transition-all duration-200 cursor-pointer
        flex flex-col min-h-[500px] bg-white dark:bg-gray-800
        ${isSelected 
          ? 'border-blue-400 dark:border-blue-500 shadow-lg scale-[1.02]' 
          : 'border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
        }
      `}
      onClick={() => onSelect(plan.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(plan.id);
        }
      }}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      aria-label={`${plan.name} plan: $${(plan.price / 100).toFixed(2)} per ${plan.interval}`}
    >
      <div className="absolute top-4 right-4" aria-hidden="true">
        {isSelected ? (
          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <CheckCircleIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
          </div>
        )}
      </div>

      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{plan.name}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-5 text-sm">{plan.description}</p>

        <div className="mb-6">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">${(plan.price / 100).toFixed(2)}</span>
          <span className="text-gray-600 dark:text-gray-400 ml-1">/{plan.interval}</span>
        </div>

        <ul className="space-y-3 mb-6" aria-label="Plan features">
          {plan.features.map((feature) => (
            <li key={feature.subscriptionFeatureId} className="flex items-start">
              <div className={`flex-shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center rounded-full ${
                feature.isIncluded 
                  ? 'bg-green-200 dark:bg-green-900/30' 
                  : 'bg-gray-200 dark:bg-gray-800'
              }`} aria-hidden="true">
                {feature.isIncluded ? (
                  <CheckCircleIcon className="w-3.5 h-3.5 text-green-700 dark:text-green-400" />
                ) : (
                  <XCircleIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <span className="ml-2.5 text-gray-800 dark:text-gray-200 text-sm">
                {feature.featureText}
                {!feature.isIncluded && <span className="sr-only"> (not included)</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {isCurrentPlan ? (
        <div className="mt-auto pt-4">
          <div className="w-full py-2.5 px-4 rounded-md border-2 border-emerald-300 dark:border-emerald-700
            bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 
            font-medium text-center text-sm" role="status">
            Current Plan
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-4">
          {plan.name === 'Free' ? (
            activeSubscription?.isCanceled ? (
              <p className="text-center text-gray-700 dark:text-gray-300 text-sm" role="status">
                Your plan will switch to the free plan on{' '}
                <time dateTime={activeSubscription.currentPeriodEnd}>
                  {new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()}
                </time>
              </p>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCancelModal(true);
                }}
                className="w-full py-2.5 px-4 rounded-md border border-gray-300 dark:border-gray-600
                  text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 
                  dark:hover:bg-gray-700 transition-colors duration-200 text-center text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-gray-500/40"
                aria-label={`Switch to ${plan.name} plan`}
              >
                {subscriptionToActOn ? 'Switch to Free Plan' : 'Select Free Plan'}
              </button>
            )
          ) : (
            trialingSubscription && plan.productId === trialingSubscription.productId ? (
              <p className="text-center text-gray-700 dark:text-gray-300 text-sm" role="status">
                Your plan will switch to {plan.name} on{' '}
                <time dateTime={activeSubscription?.currentPeriodEnd || ''}>
                  {new Date(activeSubscription?.currentPeriodEnd || '').toLocaleDateString()}
                </time>
              </p>
            ) : (
              <Link
                href={`/account/subscription/modify?productId=${plan.productId}`}
                className="block w-full py-2.5 px-4 rounded-md border border-blue-300 dark:border-blue-800
                  text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 
                  dark:hover:bg-blue-900/30 transition-colors duration-200 text-center text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Subscribe to ${plan.name} plan: $${(plan.price / 100).toFixed(2)} per ${plan.interval}`}
              >
                Subscribe Now
              </Link>
            )
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Current Subscription"
        message="Are you sure you want to switch to the Free plan? You will still have access to your current plan's features until the end of your billing period."
        confirmText={isCancelling ? (
          <span className="flex items-center">
            <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
            Processing...
          </span>
        ) : "Switch to Free"}
        confirmStyle="danger"
        isLoading={isCancelling}
      />
    </div>
  );
}