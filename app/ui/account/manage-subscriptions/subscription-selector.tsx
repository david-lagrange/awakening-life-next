'use client';

import { useState } from 'react';
import type { SubscriptionPlan, UserSubscriptionDetails } from '@/app/lib/actions/subscription/subscription-actions';
import SubscriptionCard from '@/app/ui/account/manage-subscriptions/subscription-card';

interface SubscriptionSelectorProps {
  plans: SubscriptionPlan[];
  currentProductId?: string;
  userSubscriptions?: UserSubscriptionDetails[];
}

export function SubscriptionSelector({ 
  plans, 
  currentProductId,
  userSubscriptions
}: SubscriptionSelectorProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    // If user has a current subscription, use that
    if (currentProductId) {
      return currentProductId;
    }

    // Auto-select based on number of plans
    if (plans.length > 2) {
      // For 3+ plans, select the middle plan
      const middleIndex = Math.floor(plans.length / 2);
      return plans[middleIndex]?.productId ?? '';
    } else if (plans.length === 2) {
      // For 2 plans, select the right (second) plan
      return plans[1]?.productId ?? '';
    } else {
      // For 1 plan or empty array, select the first/only plan
      return plans[0]?.productId ?? '';
    }
  });

  const handleSelect = (productId: string) => {
    setSelectedProductId(productId);
  };

  return (
    <div 
      className={`
        grid gap-6 mx-auto
        ${plans.length > 2 
          ? 'md:grid-cols-3 max-w-6xl' 
          : plans.length === 2
            ? 'md:grid-cols-2 max-w-4xl'
            : 'grid-cols-1 max-w-md'
        }
      `}
      role="radiogroup"
      aria-label="Subscription plans"
    >
      {plans.map((plan) => (
        <div
          key={plan.productId}
          className={`
            ${plan.productId === currentProductId 
              ? 'order-last md:order-none' 
              : 'order-first md:order-none'
            }
          `}
        >
          <SubscriptionCard
            plan={plan}
            isSelected={selectedProductId === plan.productId}
            onSelect={() => handleSelect(plan.productId ?? '')}
            isCurrentPlan={plan.productId === currentProductId}
            userSubscriptions={userSubscriptions}
          />
        </div>
      ))}
    </div>
  );
}