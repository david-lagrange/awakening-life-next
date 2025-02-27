import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import PaymentMethodsContainer from '@/app/ui/account/billing/payment-methods/payment-methods-container';
import { PaymentMethodsListSkeleton } from '@/app/ui/account/billing/payment-methods/skeletons';
import { fetchCustomerPaymentMethods } from '@/app/lib/actions/subscription/subscription-actions';

export const metadata: Metadata = {
  title: 'Payment Methods',
  description: 'Manage your payment methods, add new cards, and set default payment options',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Payment Methods - Awakening Life',
    description: 'Manage your payment methods, add new cards, and set default payment options',
    type: 'website',
    images: [{
      url: '/payment-methods-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Payment Methods',
    }],
  },
};

export default async function PaymentMethodsPage() {
  // Fetch initial data on the server
  const { paymentMethods, error } = await fetchCustomerPaymentMethods();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <nav aria-label="Breadcrumb">
        <Link
          href="/account/billing"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Billing
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Payment Methods
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<PaymentMethodsListSkeleton />}>
          <PaymentMethodsContainer initialPaymentMethods={paymentMethods || []} initialError={error} />
        </Suspense>
      </div>
    </div>
  );
}
