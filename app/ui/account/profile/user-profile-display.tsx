'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { PencilIcon, UserCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { updateUserProfile, type UpdateUserFormState } from '@/app/lib/actions/user/profile-actions';

interface UserProfileDisplayProps {
  user: {
    userName: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    roles: string[];
  };
  subscriptionRoles: {
    roleId: string;
    roleName: string;
  }[];
}

export default function UserProfileDisplay({ user, subscriptionRoles }: UserProfileDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialState: UpdateUserFormState = { message: undefined, errors: {} };
  const [state, formAction] = useActionState(updateUserProfile, initialState);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await formAction(formData);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    const firstInitial = user.firstName?.charAt(0) || user.userName.charAt(0);
    const lastInitial = user.lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <section 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-5 sm:p-6"
      aria-labelledby="profile-heading"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3" aria-hidden="true">
            <UserCircleIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          </div>
          <h2 id="profile-heading" className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Profile
          </h2>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md
              text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800
              bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label="Edit profile"
          >
            <PencilIcon className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div 
            className="h-24 w-24 rounded-full bg-blue-200 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 text-2xl font-bold shadow-sm"
            aria-hidden="true"
            role="img"
            aria-label={`${user.userName}'s profile avatar with initials ${getInitials()}`}
          >
            {getInitials()}
          </div>
          {!isEditing && (
            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {user.userName}
            </p>
          )}
        </div>

        <div className="flex-grow">
          {isEditing ? (
            <form 
              action={handleSubmit} 
              className="space-y-4"
              aria-labelledby="edit-profile-heading"
            >
              <div className="sr-only" id="edit-profile-heading">Edit your profile information</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    defaultValue={user.userName}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 
                      px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                    required
                    aria-required="true"
                    aria-invalid={state.errors?.userName ? "true" : "false"}
                    aria-describedby={state.errors?.userName ? "userName-error" : undefined}
                  />
                  {state.errors?.userName && (
                    <div 
                      className="mt-2 flex items-start"
                      id="userName-error"
                      role="alert"
                    >
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5" aria-hidden="true">
                        <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                      </div>
                      <p className="text-sm text-red-800 dark:text-red-400">
                        {state.errors.userName.join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="email-display" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
                    Email
                  </label>
                  <p 
                    id="email-display"
                    className="px-3 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700"
                    aria-readonly="true"
                  >
                    {user.email}
                  </p>
                  <input type="hidden" name="email" value={user.email} />
                </div>

                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={user.firstName || ''}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 
                      px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                    aria-invalid={state.errors?.firstName ? "true" : "false"}
                    aria-describedby={state.errors?.firstName ? "firstName-error" : undefined}
                  />
                  {state.errors?.firstName && (
                    <div 
                      className="mt-2 flex items-start"
                      id="firstName-error"
                      role="alert"
                    >
                      <p className="text-sm text-red-800 dark:text-red-400">
                        {state.errors.firstName.join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    defaultValue={user.lastName || ''}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 
                      px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                    aria-invalid={state.errors?.lastName ? "true" : "false"}
                    aria-describedby={state.errors?.lastName ? "lastName-error" : undefined}
                  />
                  {state.errors?.lastName && (
                    <div 
                      className="mt-2 flex items-start"
                      id="lastName-error"
                      role="alert"
                    >
                      <p className="text-sm text-red-800 dark:text-red-400">
                        {state.errors.lastName.join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    defaultValue={user.phoneNumber || ''}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 
                      px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                    aria-invalid={state.errors?.phoneNumber ? "true" : "false"}
                    aria-describedby={state.errors?.phoneNumber ? "phoneNumber-error" : undefined}
                  />
                  {state.errors?.phoneNumber && (
                    <div 
                      className="mt-2 flex items-start"
                      id="phoneNumber-error"
                      role="alert"
                    >
                      <p className="text-sm text-red-800 dark:text-red-400">
                        {state.errors.phoneNumber.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {state.message && (
                <div 
                  className="mt-4 p-4 rounded-md"
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

              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                    text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                    hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto transition-colors
                    focus:outline-none focus:ring-2 focus:ring-gray-500/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="flex justify-center items-center px-4 py-2.5 
                    border border-blue-300 dark:border-blue-800 text-sm font-medium rounded-md 
                    text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20
                    hover:bg-blue-200 dark:hover:bg-blue-900/30 w-full sm:w-auto transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <h3 className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1" id="email-label">
                    Email
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200" aria-labelledby="email-label">
                    {user.email}
                  </p>
                </div>

                {(user.firstName || user.lastName) && (
                  <div>
                    <h3 className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1" id="name-label">
                      Full Name
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200" aria-labelledby="name-label">
                      {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                    </p>
                  </div>
                )}

                {user.phoneNumber && (
                  <div>
                    <h3 className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1" id="phone-label">
                      Phone
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200" aria-labelledby="phone-label">
                      {user.phoneNumber}
                    </p>
                  </div>
                )}
              </div>

              {subscriptionRoles.length > 0 && (
                <div className="pt-5 mt-5 border-t border-gray-300 dark:border-gray-700">
                  <h3 className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3" id="roles-label">
                    Features & Permissions
                  </h3>
                  <div className="flex flex-wrap gap-2" aria-labelledby="roles-label">
                    {subscriptionRoles.map((role) => (
                      <span
                        key={role.roleId}
                        className="px-3 py-1 text-xs font-medium rounded-full 
                          bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300
                          border border-blue-200 dark:border-blue-800"
                      >
                        {role.roleName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 