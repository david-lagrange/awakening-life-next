import { CreditCardIcon } from '@heroicons/react/24/outline';

export function PaymentMethodsListSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <CreditCardIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        </div>
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-300 dark:border-gray-700"
          >
            {/* Mobile Layout */}
            <div className="flex flex-col space-y-3 sm:hidden">
              <div className="flex items-center justify-between pr-12">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>

            {/* Desktop Layout - Original */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AddPaymentMethodSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6">
      <div className="flex items-center mb-5">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <CreditCardIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        </div>
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-5"></div>
      
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
    </div>
  );
} 