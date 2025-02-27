'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { sendPasswordReset } from '@/app/lib/actions/auth/password-reset-actions';
import { EnvelopeIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface RequestPasswordResetProps {
  email: string;
}

export default function RequestPasswordReset({ email }: RequestPasswordResetProps) {
  const [cooldown, setCooldown] = useState(0);
  const [state, formAction] = useActionState(sendPasswordReset, {
    message: null,
    errors: {},
  });

  const handleSubmit = async (formData: FormData) => {
    if (cooldown > 0) return;
    
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700" aria-labelledby="password-reset-heading">
      <div className="flex items-center mb-5">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <EnvelopeIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
        </div>
        <h2 id="password-reset-heading" className="text-lg font-semibold text-gray-900 dark:text-white">Password Reset Link</h2>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Can&apos;t remember your current password? Request a reset link to be sent to your email address (<span className="font-medium">{email}</span>).
      </p>

      <form action={handleSubmit}>
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          disabled={cooldown > 0}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-blue-300 dark:border-blue-800 
            text-sm font-medium rounded-md text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20
            hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
            focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed 
            disabled:hover:bg-blue-100 dark:disabled:hover:bg-blue-900/20 transition-colors"
        >
          {cooldown > 0 && (
            <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
          )}
          {cooldown > 0 
            ? `Send Reset Link (${cooldown}s)` 
            : 'Send Reset Link'}
        </button>
      </form>

      {state.message && (
        <div className="mt-4 p-4 rounded-md text-sm">
          {state.message === 'success' ? (
            <div className="flex items-start text-emerald-800 dark:text-emerald-400">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-900/30 mr-2.5 mt-0.5">
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <p>Password reset email sent successfully! Please check your inbox.</p>
            </div>
          ) : (
            <div className="flex items-start text-red-800 dark:text-red-400">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5">
                <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
              </div>
              <p>{state.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 