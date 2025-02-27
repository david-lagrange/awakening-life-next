'use client';

import { useActionState } from 'react';
import { register, RegisterState } from '@/app/lib/actions/auth/register-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, UserPlusIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function CreateAccountForm() {
  const router = useRouter();
  const initialState: RegisterState = { message: null, errors: {} };
  const [state, formAction] = useActionState(register, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    await formAction(formData);
    setIsSubmitting(false);
    
    if (!state.errors && !state.message) {
      router.push('/auth/login?message=Account created successfully. Please sign in.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3" aria-hidden="true">
          <UserPlusIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white" id="create-account-heading">
          Create Your Account
        </h2>
      </div>

      {state.message && (
        <div 
          className="mb-5 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5" aria-hidden="true">
              <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
            </div>
            <p className="text-sm text-red-800 dark:text-red-400">{state.message}</p>
          </div>
        </div>
      )}

      <form 
        action={handleSubmit} 
        className="space-y-5" 
        noValidate
        aria-labelledby="create-account-heading"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
            placeholder="Enter your email"
            aria-required="true"
            aria-invalid={state.errors?.email ? "true" : "false"}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
          />
          {state.errors?.email && (
            <div 
              className="mt-2 flex items-start" 
              id="email-error"
              role="alert"
            >
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5" aria-hidden="true">
                <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
              </div>
              <p className="text-sm text-red-800 dark:text-red-400">
                {state.errors.email.join(', ')}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
              placeholder="Create a password"
              aria-required="true"
              aria-invalid={state.errors?.password ? "true" : "false"}
              aria-describedby="password-requirements password-error"
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
          {state.errors?.password && (
            <div 
              className="mt-2 flex items-start"
              id="password-error"
              role="alert"
            >
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5" aria-hidden="true">
                <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
              </div>
              <p className="text-sm text-red-800 dark:text-red-400">
                {state.errors.password.join(', ')}
              </p>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400" id="password-requirements">
            Password must be at least 6 characters long.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
              placeholder="Confirm your password"
              aria-required="true"
              aria-invalid={state.errors?.confirmPassword ? "true" : "false"}
              aria-describedby={state.errors?.confirmPassword ? "confirm-password-error" : undefined}
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
          {state.errors?.confirmPassword && (
            <div 
              className="mt-2 flex items-start"
              id="confirm-password-error"
              role="alert"
            >
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5" aria-hidden="true">
                <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
              </div>
              <p className="text-sm text-red-800 dark:text-red-400">
                {state.errors.confirmPassword.join(', ')}
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center py-2.5 px-4 
            border border-blue-300 dark:border-blue-800 text-sm font-medium rounded-md 
            text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20
            hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
            focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed 
            disabled:hover:bg-blue-100 dark:disabled:hover:bg-blue-900/20 transition-colors"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
} 