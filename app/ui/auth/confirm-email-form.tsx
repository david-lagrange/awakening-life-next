'use client';

import { useActionState } from 'react';
import { EmailConfirmationState, resendConfirmation } from '@/app/lib/actions/auth/confirm-email-actions';
import { useState } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function ConfirmEmailForm({ email }: { email: string }) {
  const [cooldown, setCooldown] = useState(0);
  const initialState: EmailConfirmationState = { message: null, errors: {} };
  const [state, formAction] = useActionState(resendConfirmation, initialState);

  const handleSubmit = async (formData: FormData) => {
    if (cooldown > 0) return;
    
    formData.set('email', email);
    await formAction(formData);
    setCooldown(60);
    
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
        <div className="flex items-center mb-5">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3" aria-hidden="true">
            <EnvelopeIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" id="confirm-email-heading">Confirm Your Email</h2>
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
              bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-labelledby="confirm-email-heading"
            aria-readonly="true"
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            If this is not your email address, please <Link href="/redirects/create-account" className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium focus:outline-none focus:underline">create a new account</Link>
          </p>
        </div>
        
        <div 
          className="p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded-md mb-5"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-2.5 mt-0.5" aria-hidden="true">
              <EnvelopeIcon className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              We&apos;ve sent a confirmation link to your email address. 
              Click the link to verify your account.
            </p>
          </div>
        </div>
        
        <form action={handleSubmit} aria-labelledby="confirm-email-heading">
          <button
            type="submit"
            disabled={cooldown > 0}
            className="w-full flex justify-center items-center py-2.5 px-4 
              border border-blue-300 dark:border-blue-800 text-sm font-medium rounded-md 
              text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20
              hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
              focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed 
              disabled:hover:bg-blue-100 dark:disabled:hover:bg-blue-900/20 transition-colors"
            aria-busy={cooldown > 0}
            aria-describedby={cooldown > 0 ? "cooldown-status" : undefined}
          >
            {cooldown > 0 && (
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            )}
            {cooldown > 0 
              ? `Resend in ${cooldown}s` 
              : 'Resend confirmation email'}
          </button>
          {cooldown > 0 && (
            <span id="cooldown-status" className="sr-only">
              Please wait {cooldown} seconds before requesting another email
            </span>
          )}
        </form>

        {state.message && (
          <div 
            className="mt-4 p-4 rounded-md"
            role={state.message === 'success' ? 'status' : 'alert'}
            aria-live={state.message === 'success' ? 'polite' : 'assertive'}
          >
            {state.message === 'success' ? (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-900/30 mr-2.5 mt-0.5" aria-hidden="true">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-400">
                  Confirmation email sent successfully!
                </p>
              </div>
            ) : (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5" aria-hidden="true">
                  <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                </div>
                <p className="text-sm text-red-800 dark:text-red-400">{state.message}</p>
              </div>
            )}
          </div>
        )}

        {state.errors?.email && (
          <div className="mt-4" role="alert" aria-live="assertive">
            {state.errors.email.map((error) => (
              <div key={error} className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5" aria-hidden="true">
                  <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                </div>
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Need help? Contact{' '}
          <Link 
            href="mailto:support@example.com" 
            className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium focus:outline-none focus:underline"
            aria-label="Contact support via email"
          >
            support@example.com
          </Link>
        </p>
      </div>
    </div>
  );
} 