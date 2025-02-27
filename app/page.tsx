import { Metadata } from 'next';
//import { auth } from '@/auth';
import ExampleClientComp from './ui/example-client/example-client-comp';

export const metadata: Metadata = {
  title: 'Home | Auth Template',
  description: 'Auth Template - A secure and customizable authentication solution for modern web applications',
  keywords: ['Auth Template', 'Authentication', 'Security', 'Login', 'Registration', 'Web App'],
  openGraph: {
    title: 'Auth Template - Secure Authentication Solution',
    description: 'A secure and customizable authentication solution for modern web applications',
    url: 'https://somedomain.com',
    type: 'website',
    images: [{
      url: '/home-specific-og.jpg',
      width: 1200,
      height: 630,
      alt: 'Auth Template Homepage',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auth Template - Secure Authentication Solution',
    description: 'A secure and customizable authentication solution for modern web applications',
    images: ['/home-specific-og.jpg'],
  },
};

export default async function Home() {

  //const session = await auth();
  
  // You can access both tokens like this:
  // console.log('Server Side Session Proof')
  // console.log('Server Side Session', session)
  // console.log('Server Side: session?.accessToken', session?.accessToken);
  // console.log('Server Side: session?.refreshToken', session?.refreshToken);
  // console.log('Server Side: session?.expires', session?.expires); // ISO string of expiration time

  return (
    <main className="min-h-screen dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-3 text-gray-900 dark:text-gray-100" id="main-heading">
        Auth Template
        </h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-400" role="doc-subtitle">
          Auth Template
        </p>
        <ExampleClientComp />
      </div>
    </main>
  );
}
