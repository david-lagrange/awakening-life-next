'use client';

import { 
  UserProfileDisplaySkeleton, 
  AccountOverviewSkeleton,
  SubscriptionDisplaySkeleton,
  ChangePasswordFormSkeleton,
  RequestPasswordResetSkeleton
} from '@/app/ui/account/profile/skeletons';
import { UserIcon, CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

export default function Loading() {
  // Get the tab from URL search params
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get('tab') || 'profile';

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Profile section skeleton */}
      <div className="mb-6">
        <UserProfileDisplaySkeleton />
      </div>
      
      {/* Tabs with actual icons and text */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
            {[
              { id: 'profile', label: 'Profile', icon: UserIcon },
              { id: 'subscription', label: 'Subscription', icon: CreditCardIcon },
              { id: 'security', label: 'Security', icon: ShieldCheckIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <div 
                  key={tab.id}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </div>
              );
            })}
          </nav>
        </div>
        
        {/* Show the appropriate skeleton based on the active tab */}
        <div className="mt-4">
          {activeTab === 'profile' && <AccountOverviewSkeleton />}
          {activeTab === 'subscription' && <SubscriptionDisplaySkeleton />}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <ChangePasswordFormSkeleton />
              <RequestPasswordResetSkeleton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 