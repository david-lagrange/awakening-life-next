'use client';

import { useActionState, useEffect } from 'react';
import { resetPassword } from '@/app/lib/actions/auth/password-reset-actions';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function ResetPasswordForm({
  token,
  email,
  urlMessage,
  urlError,
}: {
  token: string;
  email: string;
  urlMessage?: string;
  urlError?: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, formAction] = useActionState(resetPassword, {
    message: null,
    errors: {},
  });

  useEffect(() => {
    if (state.message === 'success') {
      router.push('/auth/login?message=Your password has been successfully reset. Please sign in with your new password.');
    }
  }, [state, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    await formAction(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3" aria-hidden="true">
            <LockClosedIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" id="reset-password-heading">
            Create New Password
          </h2>
        </div>

        {urlMessage && (
          <div 
            className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-md text-sm"
            role="status"
            aria-live="polite"
          >
            {urlMessage}
          </div>
        )}
        {urlError && (
          <div 
            className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md text-sm"
            role="alert"
            aria-live="assertive"
          >
            {urlError}
          </div>
        )}

        <form action={handleSubmit} aria-labelledby="reset-password-heading">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="token" value={token} />
          
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
                aria-required="true"
                aria-invalid={state.errors?.password ? "true" : "false"}
                aria-describedby={state.errors?.password ? "password-error" : "password-requirements"}
                autoComplete="new-password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            <p id="password-requirements" className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Password must be at least 6 characters long.
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
                aria-required="true"
                aria-invalid={state.errors?.confirmPassword ? "true" : "false"}
                aria-describedby={state.errors?.confirmPassword ? "confirm-password-error" : undefined}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        {state.message && (
          <div 
            className="mt-4 text-sm"
            role={state.message === 'success' ? 'status' : 'alert'}
            aria-live={state.message === 'success' ? 'polite' : 'assertive'}
          >
            {state.message === 'success' ? (
              <p className="text-teal-700 dark:text-teal-500">
                Password reset successful! You can now{' '}
                <Link 
                  href="/auth/login" 
                  className="text-blue-500 hover:text-blue-400 focus:outline-none focus:underline"
                >
                  sign in
                </Link>
                {' '}with your new password.
              </p>
            ) : (
              <p className="text-red-500">{state.message}</p>
            )}
          </div>
        )}

        {Object.entries(state.errors || {}).map(([field, errors]) => (
          errors && errors.map((error) => (
            <p 
              key={`${field}-${error}`} 
              className="mt-4 text-sm text-red-500"
              id={`${field}-error`}
              role="alert"
            >
              {error}
            </p>
          ))
        ))}
      </div>
    </div>
  );
} 