import { Metadata } from 'next';
import ForgotPasswordForm from '@/app/ui/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const message = params?.message || '';
  const error = params?.error || '';

  return (
    <main className="flex min-h-[calc(100vh-6rem)] dark:bg-gray-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Reset Your Password</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>
        <ForgotPasswordForm urlMessage={message} urlError={error} />
      </div>
    </main>
  );
} 