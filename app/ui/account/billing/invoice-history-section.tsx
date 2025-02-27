import { Suspense } from 'react';
import { fetchCustomerInvoices } from '@/app/lib/actions/subscription/subscription-actions';
import InvoiceHistory from '@/app/ui/account/billing/invoice-history';
import { InvoiceHistorySkeleton } from '@/app/ui/account/billing/skeletons';

export default async function InvoiceHistorySection() {
  return (
    <section aria-labelledby="invoice-history-heading">
      <h2 id="invoice-history-heading" className="sr-only">Invoice History</h2>
      <Suspense 
        fallback={<InvoiceHistorySkeleton aria-label="Loading invoice history..." />}
      >
        <InvoiceHistoryContent />
      </Suspense>
    </section>
  );
}

// This component does the actual data fetching
async function InvoiceHistoryContent() {
  // This data fetching happens independently from the rest of the page
  const { invoices, error: invoicesError } = await fetchCustomerInvoices();
  
  return (
    <div aria-live="polite">
      <InvoiceHistory invoices={invoices} error={invoicesError} />
    </div>
  );
} 