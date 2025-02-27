import Link from 'next/link';
import { PaymentMethodsListSkeleton } from '@/app/ui/account/billing/payment-methods/skeletons';
import { CreditCardIcon } from '@heroicons/react/24/outline';

export default function Loading() {
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
        <PaymentMethodsListSkeleton />
        
        {/* Skeleton for AddPaymentMethod component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6">
          <div className="flex items-center mb-5">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
              <CreditCardIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            </div>
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-5"></div>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 