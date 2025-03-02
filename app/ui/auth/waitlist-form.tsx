'use client';

import { useActionState } from 'react';
import { joinWaitlist, WaitlistState } from '@/app/lib/actions/auth/waitlist-actions';
import { useState } from 'react';
import { EnvelopeIcon, XCircleIcon, CheckCircleIcon, ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function WaitlistForm() {
  const initialState: WaitlistState = { message: null, errors: {}, success: false };
  const [state, formAction] = useActionState(joinWaitlist, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className={`${state.success ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30 flex items-center justify-center' : 'bg-white/80 dark:bg-gray-800/80 border-transparent'} backdrop-blur-sm rounded-lg p-4 w-full`}>
      {state.message && !state.success && (
        <div 
          className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-md"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full mr-2 mt-0.5 bg-red-200 dark:bg-red-900/30" aria-hidden="true">
              <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
            </div>
            <p className="text-sm text-red-800 dark:text-red-400">
              {state.message}
            </p>
          </div>
        </div>
      )}

      {state.success && (
        <div 
          className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-md w-full"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center sm:justify-center">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full mr-2 bg-green-200 dark:bg-green-900/30" aria-hidden="true">
              <CheckCircleIcon className="h-3.5 w-3.5 text-green-700 dark:text-green-400" />
            </div>
            <p className="text-sm text-green-800 dark:text-green-400 sm:text-center">
              {state.message}
            </p>
          </div>
        </div>
      )}

      {!state.success ? (
        <form 
          action={formAction}
          className="flex flex-col sm:flex-row gap-3" 
          noValidate
          onSubmit={() => setIsSubmitting(true)}
        >
          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                id="waitlist-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                placeholder="Enter your email address"
                aria-required="true"
                aria-invalid={state.errors?.email ? "true" : "false"}
                aria-describedby={state.errors?.email ? "email-error" : undefined}
                disabled={isSubmitting}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
            {state.errors?.email && (
              <div 
                className="mt-1.5 flex items-start" 
                id="email-error"
                role="alert"
              >
                <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-1.5 mt-0.5" aria-hidden="true">
                  <XCircleIcon className="h-3 w-3 text-red-700 dark:text-red-400" />
                </div>
                <p className="text-xs text-red-800 dark:text-red-400">
                  {state.errors.email.join(', ')}
                </p>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className={`flex-shrink-0 flex justify-center items-center py-2.5 px-4 
              border text-sm font-medium rounded-md transition-colors
              ${isSubmitting
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40'}`}
            disabled={isSubmitting}
            aria-disabled={isSubmitting ? "true" : "false"}
          >
            {isSubmitting ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                Processing...
              </>
            ) : (
              <>
                Join Waitlist
                <ArrowRightIcon className="ml-1.5 w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      ) : null}
      
      {!state.success && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center sm:text-left">
          We&apos;ll notify you when Awakening Life is ready for beta testing.
        </p>
      )}
    </div>
  );
} 