'use client';

import { useActionState } from 'react';
import { useState } from 'react';
import { changePassword, ChangePasswordState } from '@/app/lib/actions/auth/password-reset-actions';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ChangePasswordForm() {
  const initialState: ChangePasswordState = { message: null, errors: {} };
  const [state, formAction] = useActionState(changePassword, initialState);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await formAction(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6" aria-labelledby="change-password-heading">
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
          <LockClosedIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
        </div>
        <h2 id="change-password-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
          Change Password
        </h2>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              required
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showCurrentPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {state.errors?.currentPassword && (
            <div className="mt-2 flex items-start">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5">
                <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
              </div>
              <p className="text-sm text-red-800 dark:text-red-400">
                {state.errors.currentPassword.join(', ')}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              required
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showNewPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {state.errors?.newPassword && (
            <div className="mt-2 flex items-start">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5">
                <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
              </div>
              <p className="text-sm text-red-800 dark:text-red-400">
                {state.errors.newPassword.join(', ')}
              </p>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              required
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {state.errors?.confirmPassword && (
            <div className="mt-2 flex items-start">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5">
                <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
              </div>
              <p className="text-sm text-red-800 dark:text-red-400">
                {state.errors.confirmPassword.join(', ')}
              </p>
            </div>
          )}
        </div>

        {state.message && (
          <div className="p-4 rounded-md">
            {state.message === 'success' ? (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-900/30 mr-2.5 mt-0.5">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-400">
                  Password updated successfully!
                </p>
              </div>
            ) : (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5">
                  <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                </div>
                <p className="text-sm text-red-800 dark:text-red-400">
                  {state.message}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-2.5 px-4 
            border border-blue-300 dark:border-blue-800 text-sm font-medium rounded-md 
            text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20
            hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 
            focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed 
            disabled:hover:bg-blue-100 dark:disabled:hover:bg-blue-900/20 transition-colors"
        >
          {isSubmitting ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
              <span>Updating...</span>
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </div>
  );
} 