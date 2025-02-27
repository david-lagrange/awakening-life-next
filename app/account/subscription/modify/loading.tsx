import { ModifySubscriptionFormSkeleton } from '@/app/ui/account/subscription/modify/skeletons';

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Change Subscription
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Review and confirm your subscription change
        </p>
      </div>

      <ModifySubscriptionFormSkeleton />
    </div>
  );
} 