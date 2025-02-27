export function ModifySubscriptionFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Order Details Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Section Header */}
        <div className="px-6 py-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        <div className="px-6 pb-6">
          {/* Current Plan */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>

          {/* New Plan */}
          <div className="py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>

          {/* Price Difference */}
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>

          {/* Features */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded mr-3" />
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 mt-6">
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
} 