'use client';

import { Invoice } from '@/app/lib/actions/subscription/subscription-actions';
import { format } from 'date-fns';
import { DocumentTextIcon, ReceiptRefundIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface InvoiceHistoryProps {
  invoices?: Invoice[];
  error?: string;
}

export default function InvoiceHistory({ invoices, error }: InvoiceHistoryProps) {
  if (error) {
    return (
      <div 
        className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-4"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-900/30 mr-2.5 mt-0.5" aria-hidden="true">
            <XCircleIcon className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
          </div>
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!invoices?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6">
        <div className="flex items-center mb-5">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3" aria-hidden="true">
            <ReceiptRefundIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          </div>
          <h2 id="invoice-history-title" className="text-lg font-semibold text-gray-900 dark:text-white">Invoice History</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300">No invoices found</p>
      </div>
    );
  }

  // Determine if we need scrolling (more than 5 invoices)
  const needsScroll = invoices.length > 5;

  return (
    <section 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden"
      aria-labelledby="invoice-history-title"
    >
      <div className="p-6 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3" aria-hidden="true">
            <ReceiptRefundIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          </div>
          <h2 id="invoice-history-title" className="text-lg font-semibold text-gray-900 dark:text-white">Invoice History</h2>
        </div>
      </div>

      {/* Desktop view - Table */}
      <div className={`hidden md:block overflow-x-auto ${needsScroll ? 'max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent' : ''}`}>
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" aria-describedby="invoice-history-title">
          <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Payment Method
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Subscription
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {invoices.map((invoice) => (
              <tr key={invoice.invoiceId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  <time dateTime={new Date(invoice.created).toISOString()}>
                    {format(new Date(invoice.created), 'PP')}
                  </time>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                  ${(invoice.amountDue / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full
                    ${invoice.status === 'paid' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {invoice.paymentMethodBrand && invoice.paymentMethodLast4
                    ? `${invoice.paymentMethodBrand} •••• ${invoice.paymentMethodLast4}`
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {invoice.productName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={invoice.invoicePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full 
                      text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 
                      transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`View invoice PDF from ${format(new Date(invoice.created), 'PP')}`}
                  >
                    <DocumentTextIcon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Cards */}
      <div className="md:hidden divide-y divide-gray-300 dark:divide-gray-700">
        {invoices.map((invoice) => (
          <div key={invoice.invoiceId} className="p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <time dateTime={new Date(invoice.created).toISOString()}>
                    {format(new Date(invoice.created), 'PP')}
                  </time>
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  ${(invoice.amountDue / 100).toFixed(2)}
                </p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full
                ${invoice.status === 'paid' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                }`}>
                {invoice.status}
              </span>
            </div>

            {invoice.paymentMethodBrand && invoice.paymentMethodLast4 && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Paid with {invoice.paymentMethodBrand} •••• {invoice.paymentMethodLast4}
              </p>
            )}

            {invoice.productName && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Subscription: {invoice.productName}
              </p>
            )}

            <div className="flex justify-end">
              <a
                href={invoice.invoicePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md
                  text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800
                  bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20
                  transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`View invoice PDF from ${format(new Date(invoice.created), 'PP')}`}
              >
                <DocumentTextIcon className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                View Invoice
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 