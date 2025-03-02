'use client';

import { useActionState } from 'react';
import { sendContactMessage, ContactState } from '@/app/lib/actions/contact/contact-actions';
import { useState } from 'react';
import { EnvelopeIcon, XCircleIcon, CheckCircleIcon, PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Define a type for the errors object to help with type checking
type ContactFormErrors = {
  name?: string[];
  email?: string[];
  subject?: string[];
  message?: string[];
};

export default function ContactForm() {
  const initialState: ContactState = { message: null, errors: {}, success: false };
  const [state, formAction] = useActionState(sendContactMessage, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to safely check for errors
  const hasFieldError = (fieldName: keyof ContactFormErrors) => {
    const errors = state.errors as ContactFormErrors;
    return errors && fieldName in errors && Array.isArray(errors[fieldName]) && (errors[fieldName]?.length ?? 0) > 0;
  };

  // Helper function to get error messages
  const getFieldErrorMessage = (fieldName: keyof ContactFormErrors) => {
    const errors = state.errors as ContactFormErrors;
    return errors && fieldName in errors && Array.isArray(errors[fieldName]) 
      ? errors[fieldName]?.join(', ') || ''
      : '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3" aria-hidden="true">
          <EnvelopeIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white" id="contact-form-heading">
          Send Us a Message
        </h2>
      </div>

      {state.success ? (
        <div 
          className="mb-5 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-md"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-200 dark:bg-green-900/30 mr-2.5 mt-0.5" aria-hidden="true">
              <CheckCircleIcon className="h-3.5 w-3.5 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Message Sent Successfully</p>
              <p className="text-xs text-green-700 dark:text-green-500 mt-1">
                Thank you for reaching out. We&apos;ll respond to your message as soon as possible.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
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
            action={async (formData) => {
              setIsSubmitting(true);
              try {
                await formAction(formData);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="space-y-5" 
            noValidate
            aria-labelledby="contact-form-heading"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                placeholder="Enter your name"
                aria-required="true"
                aria-invalid={hasFieldError('name') ? "true" : "false"}
                aria-describedby={hasFieldError('name') ? "name-error" : undefined}
                disabled={isSubmitting}
              />
              {hasFieldError('name') && (
                <div 
                  className="mt-2 flex items-start" 
                  id="name-error"
                  role="alert"
                >
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5" aria-hidden="true">
                    <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-400">
                    {getFieldErrorMessage('name')}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
                Email Address
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
                aria-invalid={hasFieldError('email') ? "true" : "false"}
                aria-describedby={hasFieldError('email') ? "email-error" : undefined}
                disabled={isSubmitting}
              />
              {hasFieldError('email') && (
                <div 
                  className="mt-2 flex items-start" 
                  id="email-error"
                  role="alert"
                >
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5" aria-hidden="true">
                    <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-400">
                    {getFieldErrorMessage('email')}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                placeholder="What is your message about?"
                aria-required="true"
                aria-invalid={hasFieldError('subject') ? "true" : "false"}
                aria-describedby={hasFieldError('subject') ? "subject-error" : undefined}
                disabled={isSubmitting}
              />
              {hasFieldError('subject') && (
                <div 
                  className="mt-2 flex items-start" 
                  id="subject-error"
                  role="alert"
                >
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5" aria-hidden="true">
                    <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-400">
                    {getFieldErrorMessage('subject')}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                placeholder="How can we help you?"
                aria-required="true"
                aria-invalid={hasFieldError('message') ? "true" : "false"}
                aria-describedby={hasFieldError('message') ? "message-error" : undefined}
                disabled={isSubmitting}
              />
              {hasFieldError('message') && (
                <div 
                  className="mt-2 flex items-start" 
                  id="message-error"
                  role="alert"
                >
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2 mt-0.5" aria-hidden="true">
                    <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-400">
                    {getFieldErrorMessage('message')}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-2.5 px-4 
                transition-colors rounded-md border border-blue-300 dark:border-blue-800 
                text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20
                hover:bg-blue-200 dark:hover:bg-blue-900/30 text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-100 
                dark:disabled:hover:bg-blue-900/20"
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-800 dark:text-blue-400" />
                  Sending...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
} 