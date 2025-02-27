'use client';

import { useActionState, useEffect, useState } from 'react';
import { authenticate } from '@/app/lib/actions/auth/login-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginForm({
  urlMessage,
  urlError,
}: {
  urlMessage?: string;
  urlError?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log('errorMessage', errorMessage);
    console.log('submitted', submitted);
    console.log('isPending', isPending);
    if (!errorMessage && !isPending && submitted) {
      router.push('/redirects/login');
      router.refresh();
    }
    else if (errorMessage && !isPending && submitted) {
      router.push(`/auth/login?error=${errorMessage}`);
      router.refresh();
    }
  }, [submitted, errorMessage, isPending, router]);

  const handleSubmit = async (formData: FormData) => {
    await formAction(formData);
    setSubmitted(true);
  };

  return (
    <div>
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
      <form 
        action={handleSubmit} 
        className=""
        aria-label="Login form"
      >
        <div className="rounded-md shadow-sm">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder="you@example.com"
              aria-required="true"
            />
          </div>
          <div className="relative mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={6}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder="••••••"
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute bottom-0 right-0 pr-3 flex items-center h-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            aria-busy={isPending}
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
} 