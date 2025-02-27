'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { UserIcon, CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { 
  SubscriptionDisplaySkeleton, 
  ChangePasswordFormSkeleton, 
  RequestPasswordResetSkeleton,
  AccountOverviewSkeleton 
} from '@/app/ui/account/profile/skeletons';

interface ProfileTabsProps {
  activeTab: string;
  children: ReactNode;
}

export default function ProfileTabs({ activeTab, children }: ProfileTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isLoading, setIsLoading] = useState(false);
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Handle scroll behavior in a single effect with proper cleanup
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    // Function to handle scrolling
    const scrollToContent = () => {
      if (tabContentRef.current) {
        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
          tabContentRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        });
      }
    };

    // Scroll when loading completes or tab changes
    if (activeTab === currentTab && !isLoading) {
      // Small delay to ensure content is rendered
      scrollTimeout = setTimeout(scrollToContent, 100);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [activeTab, currentTab, isLoading]);

  // Reset loading state when server-rendered activeTab matches client state
  useEffect(() => {
    if (activeTab === currentTab && isLoading) {
      setIsLoading(false);
    }
  }, [activeTab, currentTab, isLoading]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'subscription', label: 'Subscription', icon: CreditCardIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === currentTab) return;
    
    // Update local state immediately for instant UI feedback
    setCurrentTab(tabId);
    setIsLoading(true);
    
    // Create new URL with updated tab parameter
    const params = new URLSearchParams(searchParams);
    params.set('tab', tabId);
    
    // Update the URL without full page refresh
    router.push(`${pathname}?${params.toString()}`);
  };

  // Render the appropriate loading skeleton based on the tab
  const renderLoadingSkeleton = () => {
    switch (currentTab) {
      case 'subscription':
        return <SubscriptionDisplaySkeleton aria-label="Loading subscription information..." />;
      case 'security':
        return (
          <div className="space-y-6" aria-label="Loading security settings...">
            <ChangePasswordFormSkeleton />
            <RequestPasswordResetSkeleton />
          </div>
        );
      case 'profile':
      default:
        return <AccountOverviewSkeleton aria-label="Loading profile information..." />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav 
          className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" 
          aria-label="Account sections"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center
                  ${isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
                `}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
              >
                <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div 
        className="mt-4" 
        ref={tabContentRef}
        role="tabpanel"
        id={`${currentTab}-panel`}
        aria-labelledby={`${currentTab}-tab`}
        tabIndex={0}
      >
        {isLoading ? (
          <div aria-live="polite" aria-busy="true">
            {renderLoadingSkeleton()}
          </div>
        ) : (
          <div aria-live="polite">
            {children}
          </div>
        )}
      </div>
    </div>
  );
} 