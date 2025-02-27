import { Metadata } from 'next';
import ResetPasswordForm from '@/app/ui/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Create a new password for your account',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Reset Password - Awakening Life',
    description: 'Create a new password for your account',
    type: 'website',
    images: [{
      url: '/reset-password-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Reset Password',
    }],
  },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{
    token?: string;
    email?: string;
    message?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  
  if (!params?.token || !params?.email) {
    return (
      <main className="flex min-h-[calc(100vh-6rem)] dark:bg-gray-900 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full flex items-center">
          <div 
            className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md w-full"
            role="alert"
            aria-live="assertive"
          >
            Invalid reset password link. Please request a new one from the <a href="/auth/forgot-password" className="underline font-medium focus:outline-none focus:ring-2 focus:ring-red-500">forgot password page</a>.
          </div>
        </div>
      </main>
    );
  }

  const decodedEmail = decodeURIComponent(params.email);

  return (
    <main className="flex min-h-[calc(100vh-6rem)] dark:bg-gray-900 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            Reset Your Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Setting new password for <span className="font-medium">{decodedEmail}</span>
          </p>
        </header>

        <ResetPasswordForm 
          token={params.token} 
          email={params.email}
          urlMessage={params?.message}
          urlError={params?.error}
        />

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Wrong email address?{' '}
          <a 
            href="/auth/forgot-password" 
            className="text-blue-500 hover:text-blue-400 focus:outline-none focus:underline"
            aria-label="Request a new password reset link for a different email"
          >
            Request a new reset link
          </a>
        </div>
      </div>
    </main>
  );
}
