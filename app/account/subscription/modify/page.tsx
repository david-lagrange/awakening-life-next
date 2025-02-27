import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { 
  fetchUserSubscriptions, 
  fetchSubscriptionPlans,
  fetchCustomerPaymentMethods 
} from '@/app/lib/actions/subscription/subscription-actions';
import ModifySubscriptionForm from '@/app/ui/account/subscription/modify/modify-subscription-form';
import { ModifySubscriptionFormSkeleton } from '@/app/ui/account/subscription/modify/skeletons';

export const metadata: Metadata = {
  title: 'Modify Subscription',
  description: 'Change your subscription plan, review pricing details, and manage payment methods',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Modify Subscription - Awakening Life',
    description: 'Change your subscription plan, review pricing details, and manage payment methods',
    type: 'website',
    images: [{
      url: '/subscription-modify-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Modify Subscription',
    }],
  },
};

export default async function ModifySubscriptionPage({
  searchParams,
}: {
  searchParams?: Promise<{ productId?: string }>;
}) {
  const params = await searchParams;
  const productId = params?.productId;

  if (!productId) {
    redirect('/account/manage-subscription');
  }

  // Fetch all necessary data
  const [currentSubscriptions, { plans }, { paymentMethods }] = await Promise.all([
    fetchUserSubscriptions(),
    fetchSubscriptionPlans(),
    fetchCustomerPaymentMethods(),
  ]);

  // If selected product is current subscription, redirect
  if (currentSubscriptions?.find(sub => sub.status === "active" || sub.status === "trialing")?.productId === productId) {
    redirect('/account/manage-subscription');
  }

  // Find selected plan
  const selectedPlan = plans?.find(plan => plan.productId === productId);
  if (!selectedPlan) {
    redirect('/account/manage-subscription');
  }

  // Get current subscription (prioritize trialing, then active)
  const currentSubscription = currentSubscriptions?.find(sub => sub.status === 'trialing') 
    || currentSubscriptions?.find(sub => sub.status === 'active')
    || null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Change Subscription
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Review and confirm your subscription change
        </p>
      </header>

      <Suspense fallback={<ModifySubscriptionFormSkeleton />}>
        <ModifySubscriptionForm
          currentSubscription={currentSubscription}
          selectedPlan={selectedPlan}
          paymentMethods={paymentMethods}
        />
      </Suspense>
    </div>
  );
}
