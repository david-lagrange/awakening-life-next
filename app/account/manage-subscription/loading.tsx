import { SubscriptionSelectorSkeleton } from '@/app/ui/account/manage-subscriptions/skeletons';

export default function Loading() {
  return (
    <div className="animate-pulse-slow">
      <SubscriptionSelectorSkeleton />
    </div>
  );
} 