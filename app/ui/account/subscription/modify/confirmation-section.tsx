'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import type { 
  UserSubscriptionDetails, 
  SubscriptionPlan,
  PaymentMethod 
} from '@/app/lib/actions/subscription/subscription-actions';
import { changeSubscription } from '@/app/lib/actions/subscription/subscription-actions';
import { CardIcon } from '@/app/ui/account/billing/payment-methods/card-icon';

interface ConfirmationSectionProps {
  currentSubscription: UserSubscriptionDetails | null;
  selectedPlan: SubscriptionPlan;
  selectedPaymentMethod: PaymentMethod | null;
  onBack: () => void;
}

export default function ConfirmationSection({
  currentSubscription,
  selectedPlan,
  selectedPaymentMethod,
  onBack,
}: ConfirmationSectionProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceDifference = currentSubscription 
    ? selectedPlan.price - currentSubscription.productCurrentDefaultPrice
    : selectedPlan.price;

  const handleSubmit = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // It's a downgrade if:
      // 1. Price difference is negative (new plan is cheaper)
      // 2. Price difference is 0 (same price, considered as downgrade)
      const isDowngrade = priceDifference <= 0;

      // For upgrades, we need a payment method unless it's a free plan
      if (!isDowngrade && selectedPlan.price > 0 && !selectedPaymentMethod) {
        setError('A payment method is required for upgrading to a paid plan.');
        return;
      }

      const result = await changeSubscription({
        newPriceId: selectedPlan.priceId!,
        paymentMethodId: !isDowngrade ? selectedPaymentMethod?.paymentMethodId : undefined,
        currentSubscriptionId: currentSubscription?.subscriptionId,
        isDowngrade: isDowngrade
      });

      if (result.success) {
        router.push('/redirects/refresh-tokens?redirect=/account/subscription/success');
      } else {
        setError(result.error || 'An unexpected error occurred');
      }
    } catch (err) {
      console.error('Error changing subscription:', err);
      setError('Failed to process subscription change. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3" aria-hidden="true">
          <CheckCircleIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white" id="confirmation-title">
          Confirm Subscription Change
        </h2>
      </div>

      <div className="space-y-6">
        {/* Plan Summary */}
        <div className="pb-6 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-4" id="plan-summary-heading">
            Plan Change Summary
          </h3>
          <div className="flex justify-between items-center" aria-labelledby="plan-summary-heading">
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
          {priceDifference > 0 && (
            <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-md" role="alert">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/50 mr-2.5 mt-0.5" aria-hidden="true">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <span className="font-medium">Due now: </span>
                    ${(priceDifference / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    This amount will be charged immediately for the plan upgrade.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        {selectedPaymentMethod && (
          <div className="pb-6 border-b border-gray-300 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-4" id="payment-method-heading">
              Payment Method
            </h3>
            <div className="flex items-center space-x-4" aria-labelledby="payment-method-heading">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800" aria-hidden="true">
                <CardIcon 
                  brand={selectedPaymentMethod.brand} 
                  className="h-5 w-5 text-gray-700 dark:text-gray-300" 
                />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedPaymentMethod.brand} •••• {selectedPaymentMethod.last4}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  Expires {selectedPaymentMethod.expMonth.toString().padStart(2, '0')}/{selectedPaymentMethod.expYear}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-md bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800" role="alert" aria-live="assertive">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5" aria-hidden="true">
                <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
              </div>
              <p className="text-sm text-red-800 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full flex items-center justify-center px-4 py-2.5 
              text-sm font-medium border border-blue-300 dark:border-blue-800
              text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20
              hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
              focus:ring-blue-500/40 rounded-md transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-100 
              dark:disabled:hover:bg-blue-900/20"
            aria-busy={isProcessing}
            aria-label="Confirm subscription change"
          >
            {isProcessing ? (
              <>
                <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                <span>Processing...</span>
              </>
            ) : (
              'Confirm Change'
            )}
          </button>

          <button
            onClick={onBack}
            disabled={isProcessing}
            className="w-full flex items-center justify-center px-4 py-2.5 
              text-sm font-medium border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 
              focus:ring-gray-500/40 rounded-md transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={priceDifference <= 0 ? 'Back to order details' : 'Back to payment method'}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            {priceDifference <= 0 ? 'Back to Order Details' : 'Back to Payment Method'}
          </button>
        </div>
      </div>
    </div>
  );
} 