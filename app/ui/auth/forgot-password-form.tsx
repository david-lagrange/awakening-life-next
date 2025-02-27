'use client';

import { useActionState } from 'react';
import { sendPasswordReset } from '@/app/lib/actions/auth/password-reset-actions';
import Link from 'next/link';
import { useState } from 'react';
import { EnvelopeIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordForm({
  urlMessage,
  urlError,
}: {
  urlMessage?: string;
  urlError?: string;
}) {
  const [email, setEmail] = useState('');
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
    <div className="space-y-6">
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700"
        aria-labelledby="reset-password-heading"
      >
        <div className="flex items-center mb-5">
          <div 
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3"
            aria-hidden="true"
          >
            <EnvelopeIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          </div>
          <h2 
            id="reset-password-heading" 
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Reset Your Password
          </h2>
        </div>

        {urlMessage && (
          <div 
            className="mb-5 p-4 bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-800 rounded-md"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start">
              <div 
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-900/30 mr-2.5 mt-0.5"
                aria-hidden="true"
              >
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <p className="text-sm text-emerald-800 dark:text-emerald-400">{urlMessage}</p>
            </div>
          </div>
        )}
        
        {urlError && (
          <div 
            className="mb-5 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start">
              <div 
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5"
                aria-hidden="true"
              >
                <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
              </div>
              <p className="text-sm text-red-800 dark:text-red-400">{urlError}</p>
            </div>
          </div>
        )}

        <p className="text-gray-700 dark:text-gray-300 mb-5">
          Enter your email address below and we&apos;ll send you a link to reset your password.
        </p>

        <form 
          action={handleSubmit}
          aria-describedby="form-description"
          role="form"
        >
          <div id="form-description" className="sr-only">
            Password reset request form. Enter your email to receive a password reset link.
          </div>
          
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
              placeholder="Enter your email"
              aria-required="true"
              aria-invalid={state.errors?.email ? "true" : "false"}
              aria-describedby={state.errors?.email ? "email-error" : undefined}
              autoComplete="email"
            />
          </div>

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
              <ArrowPathIcon 
                className="h-4 w-4 mr-2 animate-spin" 
                aria-hidden="true" 
              />
            )}
            {cooldown > 0 
              ? `Send Reset Link (${cooldown}s)` 
              : 'Send Reset Link'}
          </button>
          
          {cooldown > 0 && (
            <div id="cooldown-status" className="sr-only">
              Please wait {cooldown} seconds before requesting another password reset email.
            </div>
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
                <div 
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-900/30 mr-2.5 mt-0.5"
                  aria-hidden="true"
                >
                  <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-400">
                  Password reset email sent successfully to <span className="font-medium">{email}</span>! Please check your inbox.
                </p>
              </div>
            ) : (
              <div className="flex items-start">
                <div 
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5"
                  aria-hidden="true"
                >
                  <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                </div>
                <p className="text-sm text-red-800 dark:text-red-400">{state.message}</p>
              </div>
            )}
          </div>
        )}

        {state.errors?.email && (
          <div 
            className="mt-4"
            id="email-error"
            role="alert"
          >
            {state.errors.email.map((error) => (
              <div key={error} className="flex items-start">
                <div 
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5"
                  aria-hidden="true"
                >
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
          Remember your password?{' '}
          <Link 
            href="/auth/login" 
            className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium focus:outline-none focus:underline"
            aria-label="Sign in to your account"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 