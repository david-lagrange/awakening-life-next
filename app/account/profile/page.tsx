import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchUserProfile } from '@/app/lib/actions/user/profile-actions';
import ChangePasswordForm from '@/app/ui/account/profile/change-password-form';
import UserProfileDisplay from '@/app/ui/account/profile/user-profile-display';
import RequestPasswordReset from '@/app/ui/account/profile/request-password-reset';
import { 
  UserProfileDisplaySkeleton, 
  ChangePasswordFormSkeleton,
  RequestPasswordResetSkeleton,
  SubscriptionDisplaySkeleton,
  AccountOverviewSkeleton
} from '@/app/ui/account/profile/skeletons';
import SubscriptionDisplay from '@/app/ui/account/profile/subscription-display';
import { 
  fetchSubscriptionPlans, 
  fetchUserSubscriptions,
  type SubscriptionPlan,
  type UserSubscriptionDetails
} from '@/app/lib/actions/subscription/subscription-actions';
import { auth } from '@/auth';
import ProfileTabs from '@/app/ui/account/profile/profile-tabs';
import { XCircleIcon } from '@heroicons/react/24/outline';
import AccountOverview from '@/app/ui/account/profile/account-overview';

export const metadata: Metadata = {
  title: 'Your Profile',
  description: 'Manage your account settings, subscription, and security preferences',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Account Profile - Auth Template',
    description: 'Manage your account settings, subscription, and security preferences',
    type: 'website',
    images: [{
      url: '/profile-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Account Profile',
    }],
  },
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{
    tab?: string;
  }>;
}) {
  const params = await searchParams;
  const activeTab = params?.tab || 'profile';
  
  // Fetch all data in parallel
  const [session, { user, error }, subscriptionData, plansData] = await Promise.all([
    auth(),
    fetchUserProfile(),
    (activeTab === 'profile' || activeTab === 'subscription') 
      ? fetchUserSubscriptions() 
      : Promise.resolve(null),
    fetchSubscriptionPlans()
  ]);

  // If no user, redirect to login
  if (!user) {
    // You can add a redirect here
    // redirect('/login');
    // For now, we'll just return early
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5">
              <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
            </div>
            <p className="text-sm text-red-800 dark:text-red-400">Please log in to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  // Get user roles from session
  const sessionRoles = session?.user?.roles || [];

  // Process subscription data
  let userSubscriptions: UserSubscriptionDetails[] = [];
  let uniqueActiveSubscriptionRoles: { roleId: string; roleName: string }[] = [];
  let plans: SubscriptionPlan[] = [];

  // Process subscription data if available
  if (subscriptionData) {
    userSubscriptions = subscriptionData || [];
    
    const activeSubscriptionRoles = [...new Set(
      userSubscriptions
        ?.filter(sub => ['active', 'trialing'].includes(sub.status))
        ?.flatMap(sub => sub.roles) || []
    )];

    // Remove duplicates while keeping the full role objects
    uniqueActiveSubscriptionRoles = Array.from(
      activeSubscriptionRoles.reduce((map, role) => 
        map.set(role.roleId, role), new Map()
      ).values()
    );
  }

  // Set plans from parallel fetch
  plans = plansData.plans || [];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5">
              <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
            </div>
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
      
      {user && (
        <>
          <div className="mb-8">
            <Suspense fallback={<UserProfileDisplaySkeleton />}>
              <UserProfileDisplay 
                user={{
                  ...user,
                  roles: sessionRoles
                }} 
                subscriptionRoles={uniqueActiveSubscriptionRoles}
              />
            </Suspense>
          </div>
          
          <ProfileTabs activeTab={activeTab}>
            {activeTab === 'profile' && (
              <div className="mt-2">
                <Suspense fallback={<AccountOverviewSkeleton />}>
                  <AccountOverview />
                </Suspense>
              </div>
            )}
            
            {activeTab === 'subscription' && (
              <div className="mt-2">
                <Suspense fallback={<SubscriptionDisplaySkeleton />}>
                  <SubscriptionDisplay 
                    plans={plans} 
                    userSubscriptions={userSubscriptions}
                  />
                </Suspense>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="mt-2 space-y-8">
                <Suspense fallback={<ChangePasswordFormSkeleton />}>
                  <ChangePasswordForm />
                </Suspense>
                <Suspense fallback={<RequestPasswordResetSkeleton />}>
                  <RequestPasswordReset email={user.email} />
                </Suspense>
              </div>
            )}
          </ProfileTabs>
        </>
      )}
    </div>
  );
}
