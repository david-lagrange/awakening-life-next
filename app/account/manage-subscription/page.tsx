import { Metadata } from 'next';
import { fetchSubscriptionPlans, fetchUserSubscriptions } from '@/app/lib/actions/subscription/subscription-actions';
import { SubscriptionSelector } from '@/app/ui/account/manage-subscriptions/subscription-selector';

export const metadata: Metadata = {
  title: 'Manage Subscription',
  description: 'Choose a subscription plan that fits your needs and manage your current subscription',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Manage Subscription - Auth Template',
    description: 'Choose a subscription plan that fits your needs and manage your current subscription',
    type: 'website',
    images: [{
      url: '/subscription-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Manage Subscription',
    }],
  },
};

export default async function ManageSubscription({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;

  // Fetch subscription plans and user subscriptions in parallel
  const [{ plans, error }, userSubscriptions] = await Promise.all([
    fetchSubscriptionPlans(),
    fetchUserSubscriptions()
  ]);
  
  // Get the current subscription product ID from the user's subscription
  const currentProductId = userSubscriptions?.find(subscription => subscription.status === 'active' || subscription.status === 'trialing')?.productId;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h1>
      </header>
      
      {error && (
        <div className="text-red-500 text-center mb-4" role="alert">{error}</div>
      )}
      
      {params?.message && (
        <div className="text-green-500 text-center mb-4" role="status">{params.message}</div>
      )}

      <SubscriptionSelector 
        plans={plans ?? []} 
        currentProductId={currentProductId}
        userSubscriptions={userSubscriptions ?? []}
      />
    </div>
  );
}
