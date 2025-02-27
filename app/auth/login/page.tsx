import LoginForm from '@/app/ui/auth/login-form';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account to access your dashboard, manage your subscription, and more.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Login - Awakening Life',
    description: 'Sign in to your account to access your dashboard, manage your subscription, and more.',
    type: 'website',
    images: [{
      url: '/login-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Login to Awakening Life',
    }],
  },
};

export default async function LoginPage({
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Sign in to your account</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link 
              href="/auth/create-account" 
              className="text-blue-500 hover:text-blue-400 focus:outline-none focus:underline"
            >
              create a new account
            </Link>
          </p>
        </div>
        <LoginForm urlMessage={message} urlError={error} />
      </div>
    </main>
  );
} 