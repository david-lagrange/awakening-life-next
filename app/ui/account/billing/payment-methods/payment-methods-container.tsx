'use client';

import { useState } from 'react';
import PaymentMethodsList from './payment-methods-list';
import AddPaymentMethod from './add-payment-method';
import { PaymentMethod, fetchCustomerPaymentMethods } from '@/app/lib/actions/subscription/subscription-actions';

interface PaymentMethodsContainerProps {
  initialPaymentMethods: PaymentMethod[];
  initialError?: string;
}

export default function PaymentMethodsContainer({ initialPaymentMethods, initialError }: PaymentMethodsContainerProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [error, setError] = useState<string | undefined>(initialError);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const { paymentMethods: methods, error: err } = await fetchCustomerPaymentMethods();
      if (methods) setPaymentMethods(methods);
      if (err) setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodAdded = () => {
    loadPaymentMethods();
  };

  return (
    <>
      <section 
        aria-label="Your payment methods"
        className="col-span-1"
        aria-busy={isLoading}
        aria-live="polite"
      >
        <PaymentMethodsList 
          paymentMethods={paymentMethods}
          error={error}
          onPaymentMethodsChange={loadPaymentMethods}
        />
      </section>
      
      <section 
        aria-label="Add a new payment method"
        className="col-span-1"
      >
        <AddPaymentMethod onSuccess={handlePaymentMethodAdded} />
      </section>
    </>
  );
} 