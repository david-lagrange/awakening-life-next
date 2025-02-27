'use client';

import { useState, useRef, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import type { 
  UserSubscriptionDetails, 
  SubscriptionPlan,
  PaymentMethod 
} from '@/app/lib/actions/subscription/subscription-actions';
import OrderDetails from '@/app/ui/account/subscription/modify/order-details';
import PaymentMethodSelection from '@/app/ui/account/subscription/modify/payment-method-selection';
import ConfirmationSection from '@/app/ui/account/subscription/modify/confirmation-section';

interface ModifySubscriptionFormProps {
  currentSubscription: UserSubscriptionDetails | null;
  selectedPlan: SubscriptionPlan;
  paymentMethods?: PaymentMethod[];
}

/**
 * A single-page flow that displays:
 * 1) Full Order Details. After continue -> collapses/folds to a smaller summary.
 * 2) Payment Method section expands. After selection -> collapses to a smaller summary.
 * 3) Confirmation area expands last.
 *
 * The user can revisit previous sections (Order Details or Payment Method) by clicking
 * on their headings or some dedicated button to expand them again.
 */
export default function ModifySubscriptionForm({
  currentSubscription,
  selectedPlan,
  paymentMethods,
}: ModifySubscriptionFormProps) {
  // Tracks which step is fully expanded (1, 2, or 3)
  // Steps: 1 = Order Details, 2 = Payment Method, 3 = Confirm
  const [expandedStep, setExpandedStep] = useState<number>(1);

  // Payment method the user selects
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Refs for each section to enable scrolling
  const orderDetailsRef = useRef<HTMLDivElement>(null);
  const paymentMethodRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Add this helper function
  const shouldSkipPayment = () => {
    const priceDifference = currentSubscription 
      ? selectedPlan.price - currentSubscription.productCurrentDefaultPrice
      : selectedPlan.price;
    return selectedPlan.price === 0 || priceDifference <= 0;
  };

  // Scroll to the active section when step changes
  useEffect(() => {
    const scrollTimeout: NodeJS.Timeout = setTimeout(() => {
      let targetRef = null;
      
      switch (expandedStep) {
        case 1:
          targetRef = orderDetailsRef;
          break;
        case 2:
          targetRef = paymentMethodRef;
          break;
        case 3:
          targetRef = confirmationRef;
          break;
      }
      
      if (targetRef?.current) {
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          targetRef?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      }
    }, 100);
    
    return () => {
      clearTimeout(scrollTimeout);
    };
  }, [expandedStep]);

  // Modify the advance handler
  const advanceToStep = (step: number) => {
    // If moving to payment step and should skip payment, go directly to confirmation
    if (step === 2 && shouldSkipPayment()) {
      setSelectedPaymentMethod(null);
      setExpandedStep(3);
    } else {
      setExpandedStep(step);
    }
  };

  const handlePaymentMethodSelected = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setExpandedStep(3);
  };

  const handleOpenOrderDetails = () => {
    setExpandedStep(1);
  };

  const handleOpenPaymentMethod = () => {
    setExpandedStep(2);
  };

  // Modify the back handler for the confirmation section
  const handleConfirmationBack = () => {
    if (shouldSkipPayment()) {
      setExpandedStep(1); // Go back to order details
    } else {
      setExpandedStep(2); // Go back to payment method
    }
  };

  return (
    <div className="space-y-6" role="form" aria-label="Modify subscription form">
      {/* --------------------
          1) ORDER DETAILS
          -------------------- */}
      <div 
        ref={orderDetailsRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        {/* Section Header For Clicking Back */}
        <button
          type="button"
          onClick={handleOpenOrderDetails}
          className="w-full text-left px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-xl"
          aria-expanded={expandedStep === 1}
          aria-controls="order-details-content"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100" id="order-details-heading">
            Order Details
          </h2>
        </button>

        {/* Transition for the expanded/collapsed content */}
        <Transition
          show={expandedStep === 1}
          enter="transition-all duration-300"
          enterFrom="max-h-0 opacity-0"
          enterTo="max-h-[1000px] opacity-100"
          leave="transition-all duration-300"
          leaveFrom="max-h-[1000px] opacity-100"
          leaveTo="max-h-0 opacity-0"
        >
          <div className="px-6 pb-6" id="order-details-content" aria-labelledby="order-details-heading">
            <OrderDetails
              currentSubscription={currentSubscription}
              selectedPlan={selectedPlan}
              onContinue={() => advanceToStep(2)}
            />
          </div>
        </Transition>

        {/* Collapsed Summary when step > 1 */}
        {expandedStep > 1 && (
          <div className="px-6 pb-4 text-sm border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedPlan.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Billed {selectedPlan.interval}ly
                </p>
              </div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                ${(selectedPlan.price / 100).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --------------------
          2) PAYMENT METHOD
          -------------------- */}
      {/*
        Hidden if step < 2. Collapsed summary if step > 2.
        Fully expanded if step == 2.
      */}
      {expandedStep >= 2 && (
        <div 
          ref={paymentMethodRef}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <button
            type="button"
            onClick={handleOpenPaymentMethod}
            className="w-full text-left px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-xl"
            aria-expanded={expandedStep === 2}
            aria-controls="payment-method-content"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100" id="payment-method-heading">
              Payment Method
            </h2>
          </button>

          <Transition
            show={expandedStep === 2}
            enter="transition-all duration-300"
            enterFrom="max-h-0 opacity-0"
            enterTo="max-h-[1000px] opacity-100"
            leave="transition-all duration-300"
            leaveFrom="max-h-[1000px] opacity-100"
            leaveTo="max-h-0 opacity-0"
          >
            <div className="px-6 pb-6" id="payment-method-content" aria-labelledby="payment-method-heading">
              <PaymentMethodSelection
                paymentMethods={paymentMethods}
                onPaymentMethodSelected={handlePaymentMethodSelected}
                onBack={() => advanceToStep(1)}
              />
            </div>
          </Transition>

          {/* Modify the Payment Method collapsed summary section */}
          {expandedStep > 2 && (
            <div className="px-6 pb-4 text-sm border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between pt-4">
                <div>
                  {shouldSkipPayment() ? (
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      No payment required
                    </p>
                  ) : (
                    <>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedPaymentMethod?.brand} •••• {selectedPaymentMethod?.last4}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Expires {String(selectedPaymentMethod?.expMonth).padStart(2, '0')}/
                        {selectedPaymentMethod?.expYear}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --------------------
          3) CONFIRMATION
          -------------------- */}
      {expandedStep === 3 && (
        <div 
          ref={confirmationRef}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          aria-labelledby="confirmation-heading"
        >
          <div className="px-6 py-4">
            <h2 id="confirmation-heading" className="sr-only">Confirmation</h2>
            <ConfirmationSection
              currentSubscription={currentSubscription}
              selectedPlan={selectedPlan}
              selectedPaymentMethod={selectedPaymentMethod}
              onBack={handleConfirmationBack}
            />
          </div>
        </div>
      )}
    </div>
  );
} 