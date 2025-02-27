import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse">
            <CheckCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mx-auto mb-4 animate-pulse"></div>
        
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mx-auto mb-8 animate-pulse"></div>

        <div className="space-y-4 max-w-sm mx-auto">
          <div className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium 
            rounded-md bg-gray-200 dark:bg-gray-700 h-10 animate-pulse">
          </div>
          
          <div className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium 
            rounded-md bg-gray-200 dark:bg-gray-700 h-10 animate-pulse">
          </div>
        </div>
      </div>
    </div>
  );
} 