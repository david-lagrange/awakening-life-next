import { UserIcon } from '@heroicons/react/24/outline';

export default function AccountOverview() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6" aria-labelledby="account-overview-heading">
      <div className="flex items-center mb-5">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <UserIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
        </div>
        <h2 id="account-overview-heading" className="text-lg font-semibold text-gray-900 dark:text-white">Account Overview</h2>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Manage your account settings and preferences.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gray-100 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 mr-2">
              <UserIcon className="h-3 w-3 text-gray-700 dark:text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Account Details</h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Your account was created on <span className="font-medium text-gray-900 dark:text-white">January 1, 2023</span>
          </p>
        </div>
        
      </div>
    </div>
  );
} 