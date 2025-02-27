export function SubscriptionSuccessPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        {/* Icon placeholder */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        
        {/* Title placeholder */}
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4" />
        
        {/* Message placeholder */}
        <div className="h-6 w-72 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8" />

        {/* Buttons placeholder */}
        <div className="space-y-4">
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
} 