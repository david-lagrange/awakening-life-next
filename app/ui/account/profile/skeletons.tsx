'use client';

import { 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

export function UserProfileDisplaySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-5 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
            <UserIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Profile
          </h1>
        </div>
        <div className="relative h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shadow-sm" />
          <div className="mt-2 h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="relative h-6 w-[90%] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            <div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="relative h-6 w-[90%] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            <div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="relative h-6 w-[90%] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-gray-300 dark:border-gray-700">
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
            <div className="flex flex-wrap gap-2">
              <div className="relative h-6 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse border border-blue-200 dark:border-blue-800" />
              <div className="relative h-6 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse border border-blue-200 dark:border-blue-800" />
              <div className="relative h-6 w-24 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse border border-blue-200 dark:border-blue-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChangePasswordFormSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <LockClosedIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Change Password
        </h2>
      </div>
      
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="relative h-10 w-full bg-white dark:bg-gray-800 rounded animate-pulse border border-gray-300 dark:border-gray-600" />
            {i === 2 && (
              <div className="mt-2 h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            )}
          </div>
        ))}
        
        <div className="relative h-10 w-full bg-blue-100 dark:bg-blue-900/20 rounded-md mt-6 animate-pulse border border-blue-300 dark:border-blue-800" />
      </div>
    </div>
  );
}

export function RequestPasswordResetSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
      <div className="flex items-center mb-5">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <EnvelopeIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Password Reset Link
        </h2>
      </div>
      <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
      <div className="relative h-10 w-full bg-blue-100 dark:bg-blue-900/20 rounded-md animate-pulse border border-blue-300 dark:border-blue-800" />
    </div>
  );
}

export function SubscriptionDisplaySkeleton() {
  return (
    <div className="mt-8 p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
            <CreditCardIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Current Subscription</h2>
        </div>
        
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="ml-3 h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        <div className="space-y-4 animate-pulse">
          <div className="flex items-baseline">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mr-2" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-1" />
          </div>
          
          <div className="mt-5 pt-5 border-t border-gray-300 dark:border-gray-700">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="grid grid-cols-1 gap-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="ml-2.5 h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-gray-300 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="ml-2.5 h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex items-start ml-7.5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="ml-2.5 h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-col space-y-3">
          <div className="h-10 bg-amber-100 dark:bg-amber-900/20 rounded-md animate-pulse border border-amber-300 dark:border-amber-800" />
          <div className="h-10 bg-red-100 dark:bg-red-900/20 rounded-md animate-pulse border border-red-300 dark:border-red-800" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-white dark:bg-gray-800 rounded-md animate-pulse border border-gray-300 dark:border-gray-700" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function AccountOverviewSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6">
      <div className="flex items-center mb-5">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <UserIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Account Overview
        </h2>
      </div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 mr-2 animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            {i === 2 && (
              <div className="mt-3 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 