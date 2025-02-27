import CreateAccountForm from '@/app/ui/auth/create-account-form';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Sign up for a new account to access our secure authentication platform and manage your subscription',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Create Account - Auth Template',
    description: 'Sign up for a new account to access our secure authentication platform and manage your subscription',
    type: 'website',
    images: [{
      url: '/signup-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Create a new account',
    }],
  },
};

export default function CreateAccountPage() {
  return (
    <main className="flex min-h-[calc(100vh-6rem)] dark:bg-gray-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Create your account</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium focus:outline-none focus:underline"
            >
              Sign in
            </Link>
          </p>
        </header>
        <CreateAccountForm />
      </div>
    </main>
  );
}
