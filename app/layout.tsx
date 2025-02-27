import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "@/app/ui/fonts/fonts";
import TopNav from "@/app/ui/nav/top-nav";
import { ThemeProvider } from '@/app/lib/providers/theme-provider';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
// import Footer from '@/app/ui/footer/footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://somedomain.com'),
  title: {
    template: '%s | Auth Template',
    default: 'Auth Template', // Used when no template is provided
  },
  description: 'Auth Template - A secure authentication solution for your web applications',
  keywords: ['Auth Template', 'Authentication', 'Security', 'Web App', 'Next.js'],
  authors: [{ name: 'David Lagrange' }],
  creator: 'David Lagrange',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://somedomain.com',
    siteName: 'Auth Template',
    title: 'Auth Template - Secure Authentication Solution',
    description: 'Auth Template - A secure authentication solution for your web applications',
    images: [{
      url: '/default-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Auth Template',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourtwitterhandle',
    creator: '@yourtwitterhandle',
    title: 'Auth Template - Secure Authentication Solution',
    description: 'Auth Template - A secure authentication solution for your web applications',
    images: ['/default-og-image.jpg'],
  },
  alternates: {
    canonical: 'https://somedomain.com',
    languages: {
      'en-US': 'https://somedomain.com/en-US',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  other: {
    'google-site-verification': 'your-google-verification-code',
    'msvalidate.01': 'your-bing-verification-code',
  },
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 flex flex-col`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TopNav />
            <div className="pt-2 md:pt-8 flex-grow">
              {props.children}
              {props.modal}
            </div>
            {/* <Footer /> */}
          </ThemeProvider>
        </SessionProvider>
        
      </body>
    </html>
  );
}
