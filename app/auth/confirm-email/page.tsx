import { Metadata } from 'next';
import ConfirmEmailForm from '@/app/ui/auth/confirm-email-form';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Confirm Email',
  description: 'Verify your email address to complete your account registration',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Confirm Your Email - Awakening Life',
    description: 'Verify your email address to complete your account registration',
    type: 'website',
    images: [{
      url: '/confirm-email-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Confirm Email',
    }],
  },
};

export default async function ConfirmEmailPage() {
  const session = await auth();
  const userEmail = session?.user?.email || '';

  return (
    <main className="flex min-h-[calc(100vh-6rem)] dark:bg-gray-900 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-3">Confirm Your Email</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your email for a confirmation link. 
            If you haven&apos;t received it, you can request a new one below.
          </p>
        </header>
        <ConfirmEmailForm email={userEmail} />
      </div>
    </main>
  );
} 