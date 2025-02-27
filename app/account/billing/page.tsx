import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { 
  fetchUserSubscriptions,
  fetchCustomerPaymentMethods
} from '@/app/lib/actions/subscription/subscription-actions';
import CurrentPricing from '@/app/ui/account/billing/current-pricing';
import NextPayment from '@/app/ui/account/billing/next-payment';
import PaymentMethod from '@/app/ui/account/billing/payment-method';
import InvoiceHistorySection from '@/app/ui/account/billing/invoice-history-section';
import { 
  CurrentPricingSkeleton,
  NextPaymentSkeleton,
  PaymentMethodSkeleton
} from '@/app/ui/account/billing/skeletons';

export const metadata: Metadata = {
  title: 'Billing & Payments',
  description: 'Manage your subscription billing, payment methods, and view invoice history',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Billing & Payments - Awakening Life',
    description: 'Manage your subscription billing, payment methods, and view invoice history',
    type: 'website',
    images: [{
      url: '/billing-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Billing & Payments',
    }],
  },
};

export default async function BillingPage() {
  const [userSubscriptions, { paymentMethods }] = await Promise.all([
    fetchUserSubscriptions(),
    fetchCustomerPaymentMethods()
  ]);

  const activeSubscription = userSubscriptions?.find(subscription => subscription.status === 'active');
  const nextSubscription = userSubscriptions?.find(subscription => subscription.status === 'trialing');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <nav aria-label="Breadcrumb">
        <Link
          href="/account/profile"
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
          Back to Profile
        </Link>
      </nav>

      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Billing & Payments
        </h1>
        <Link
          href="/account/profile?tab=subscription"
          className="flex items-center justify-center px-4 py-2.5 text-sm font-medium 
            transition-colors rounded-md bg-blue-100 dark:bg-blue-900/20
            border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-400
            hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
            focus:ring-blue-500/40"
        >
          Manage Subscription
        </Link>
      </header>

      <section aria-label="Billing summary" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Suspense fallback={<CurrentPricingSkeleton />}>
          <CurrentPricing subscription={activeSubscription ?? null} changingSoon={nextSubscription ? true : false} />
        </Suspense>

        <Suspense fallback={<NextPaymentSkeleton />}>
          <NextPayment subscription={nextSubscription ? nextSubscription : activeSubscription ?? null} />
        </Suspense>

        <Suspense fallback={<PaymentMethodSkeleton />}>
          <PaymentMethod 
            paymentMethod={paymentMethods?.find(pm => pm.isDefault)} 
          />
        </Suspense>
      </section>

      <section aria-label="Invoice history">
        <InvoiceHistorySection />
      </section>
    </div>
  );
}
