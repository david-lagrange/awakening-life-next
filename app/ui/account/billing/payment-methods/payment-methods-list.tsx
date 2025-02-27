'use client';

import { useState } from 'react';
import { PaymentMethod, setDefaultPaymentMethod, deletePaymentMethod } from '@/app/lib/actions/subscription/subscription-actions';
import { CheckCircleIcon, TrashIcon, CreditCardIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { CardIcon } from './card-icon';
import ConfirmModal from '@/app/ui/common/confirm-modal';

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  error?: string;
  onPaymentMethodsChange: () => void;
}

export default function PaymentMethodsList({ 
  paymentMethods, 
  error,
  onPaymentMethodsChange 
}: PaymentMethodsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId);
      onPaymentMethodsChange();
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    setDeletingId(paymentMethodId);
    try {
      const result = await deletePaymentMethod(paymentMethodId);
      if (!result.success) {
        throw new Error(result.error);
      }
      onPaymentMethodsChange();
    } catch (error) {
      console.error('Error deleting payment method:', error);
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setSelectedMethodId(null);
    }
  };

  const openDeleteModal = (paymentMethodId: string) => {
    setSelectedMethodId(paymentMethodId);
    setShowDeleteModal(true);
  };

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-4" role="alert">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5">
            <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" aria-hidden="true" />
          </div>
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!paymentMethods?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6" aria-labelledby="payment-methods-heading">
        <div className="flex items-center mb-5">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
            <CreditCardIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h2 id="payment-methods-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Methods
          </h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300">No payment methods found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6" aria-labelledby="payment-methods-heading">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
            <CreditCardIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h2 id="payment-methods-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Methods
          </h2>
        </div>
        
        <ul className="space-y-4">
          {paymentMethods.map((method) => (
            <li key={method.paymentMethodId} className="relative">
              {!method.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(method.paymentMethodId);
                  }}
                  disabled={deletingId === method.paymentMethodId}
                  className="absolute right-4 top-4 p-1.5 text-gray-500 hover:text-red-700 
                    dark:text-gray-400 dark:hover:text-red-400 rounded-full 
                    hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors
                    z-10 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                  aria-label={`Delete ${method.brand} card ending in ${method.last4}`}
                >
                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              <div
                className={`
                  relative p-4 rounded-lg
                  bg-gray-100 dark:bg-gray-900
                  border ${method.isDefault 
                    ? 'border-blue-300 dark:border-blue-800' 
                    : 'border-gray-300 dark:border-gray-700'}
                  transition-all duration-300 cursor-pointer
                  hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700
                  ${method.isDefault ? 'shadow-sm' : ''}
                `}
                onClick={() => !method.isDefault && handleSetDefault(method.paymentMethodId)}
                role="button"
                tabIndex={0}
                aria-label={`${method.isDefault ? 'Default payment method' : 'Set as default payment method'}: ${method.brand} card ending in ${method.last4}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!method.isDefault) {
                      handleSetDefault(method.paymentMethodId);
                    }
                  }
                }}
              >
                {/* Mobile Layout */}
                <div className="flex flex-col space-y-3 sm:hidden">
                  <div className="flex items-center justify-between pr-12">
                    <div className="flex items-center space-x-3">
                      <CardIcon 
                        brand={method.brand} 
                        className="h-6 w-6 text-gray-800 dark:text-gray-300" 
                        aria-hidden="true"
                      />
                      <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {method.brand}
                      </span>
                      <div className="font-mono text-gray-700 dark:text-gray-400">
                        <span className="sr-only">Card ending in </span>
                        •••• {method.last4}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Expires <time dateTime={`${method.expYear}-${method.expMonth.toString().padStart(2, '0')}`}>{method.expMonth.toString().padStart(2, '0')}/{method.expYear}</time>
                    </div>
                    {method.isDefault ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400
                        border border-emerald-200 dark:border-emerald-800" role="status">
                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                        Default
                      </span>
                    ) : (
                      <span className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                        Set as default
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between group pr-12">
                  <div className="flex items-center space-x-4">
                    <CardIcon 
                      brand={method.brand} 
                      className="h-6 w-6 text-gray-800 dark:text-gray-300" 
                      aria-hidden="true"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {method.brand}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="font-mono text-gray-700 dark:text-gray-400">
                      <span className="sr-only">Card ending in </span>
                      •••• {method.last4}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Expires <time dateTime={`${method.expYear}-${method.expMonth.toString().padStart(2, '0')}`}>{method.expMonth.toString().padStart(2, '0')}/{method.expYear}</time>
                    </div>
                    {method.isDefault ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400
                        border border-emerald-200 dark:border-emerald-800" role="status">
                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                        Default
                      </span>
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 
                        group-hover:opacity-100 transition-opacity duration-200">
                        <span className="px-3 py-1 rounded-full text-sm font-medium
                          border border-blue-300 dark:border-blue-700
                          text-blue-700 dark:text-blue-400
                          bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                          Make default
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (selectedMethodId) await handleDelete(selectedMethodId);
        }}
        title="Delete Payment Method"
        message="Are you sure you want to delete this payment method? This action cannot be undone."
        confirmText="Delete"
        confirmStyle="danger"
        isLoading={deletingId === selectedMethodId}
      />
    </>
  );
} 