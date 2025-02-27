import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircleIcon, CreditCardIcon, UserIcon } from '@heroicons/react/24/outline';
import { fetchUserSubscriptions } from '@/app/lib/actions/subscription/subscription-actions';

export const metadata: Metadata = {
  title: 'Subscription Updated',
  description: 'Your subscription has been successfully updated',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Subscription Updated - Auth Template',
    description: 'Your subscription has been successfully updated',
    type: 'website',
    images: [{
      url: '/subscription-success-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Subscription Success',
    }],
  },
};

export default async function SubscriptionSuccessPage() {
  const subscriptions = await fetchUserSubscriptions();
  
  const activeSubscription = subscriptions?.find(sub => sub.status === 'trialing') || 
                            subscriptions?.find(sub => sub.status === 'active');

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-8 text-center">
        <div className="flex justify-center mb-6" aria-hidden="true">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-900/30">
            <CheckCircleIcon className="h-10 w-10 text-emerald-700 dark:text-emerald-400" />
          </div>
        </div>
        
        <header>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Subscription Updated Successfully
          </h1>
        </header>
        
        <div role="status" aria-live="polite">
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            Your subscription has been changed to <span className="font-medium text-gray-900 dark:text-white">
              {activeSubscription?.productName || "your new plan"}
            </span>
          </p>
        </div>

        <nav className="space-y-4 max-w-sm mx-auto" aria-label="Post-subscription options">
          <Link
            href="/account/billing"
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium 
              transition-colors rounded-md bg-blue-100 dark:bg-blue-900/20
              border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-400
              hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
              focus:ring-blue-500/40"
            aria-label="View your billing details"
          >
            <CreditCardIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>View Billing Details</span>
          </Link>
          
          <Link
            href="/account/profile"
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium 
              transition-colors rounded-md bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 
              focus:ring-gray-500/40"
            aria-label="Return to your profile page"
          >
            <UserIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>Return to Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
} 