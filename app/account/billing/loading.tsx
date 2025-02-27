import {
  CurrentPricingSkeleton,
  NextPaymentSkeleton,
  PaymentMethodSkeleton,
  InvoiceHistorySkeleton
} from '@/app/ui/account/billing/skeletons';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Link
        href="/account/profile"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
        Back to Profile
      </Link>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CurrentPricingSkeleton />
        <NextPaymentSkeleton />
        <PaymentMethodSkeleton />
      </div>

      <InvoiceHistorySkeleton />
    </div>
  );
} 