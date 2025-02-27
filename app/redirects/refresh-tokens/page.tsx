'use client';

import { refreshTokens, signOutAction } from '@/app/lib/actions/auth/login-actions';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function RefreshTokensPage() {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    // Call the hook at the top-level of your component.
    const session = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/';

    // Log the referring page when the component mounts.
    useEffect(() => {
        console.log('User came from:', document.referrer);
    }, []);

    // Add a new effect to handle the loading progress
    useEffect(() => {
        // Start at 0%
        setLoadingProgress(0);
        setIsComplete(false);
        
        // Quickly move to 30% to show initial progress
        const timer1 = setTimeout(() => setLoadingProgress(30), 300);
        
        // Move to 60% after a bit
        const timer2 = setTimeout(() => setLoadingProgress(60), 1000);
        
        // Move to 85% to simulate waiting for server response
        const timer3 = setTimeout(() => setLoadingProgress(85), 2000);
        
        // Add a safety timeout to redirect if the operation takes too long
        const safetyTimeout = setTimeout(() => {
            console.error('Refresh operation timed out');
            router.push('/auth/login?error=Session+refresh+timed+out');
        }, 15000); // 15 seconds timeout
        
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(safetyTimeout);
        };
    }, [router]);

    useEffect(() => {
        const accessToken = session?.data?.accessToken;
        const refreshToken = session?.data?.refreshToken;
        console.log('Session status:', session.status);
        console.log('accessToken', accessToken ? 'present' : 'missing');
        console.log('refreshToken', refreshToken ? 'present' : 'missing');

        async function handleRefreshTokens(accessToken: string, refreshToken: string) {
            try {
                // First sign out to clear the current session
                await signOutAction();
                
                // Then attempt to refresh tokens
                const result = await refreshTokens(accessToken, refreshToken);
                
                if (!result.success) {
                    //console.error('Token refresh failed:', result.error);
                    // throw new Error(result.error || 'Failed to refresh tokens');
                }
                
                console.log('Tokens refreshed successfully');
                // Set to 100% when complete
                setLoadingProgress(100);
                setIsComplete(true);
                // Add a small delay before redirecting so user can see 100%
                setTimeout(() => router.push(redirectPath), 500);
            } catch (error) {
                console.error('Error during token refresh:', error);
                // Redirect to login with error message
                router.push('/auth/login?error=Session+refresh+failed');
            }
        }

        // Only attempt refresh if we have both tokens and session is authenticated
        if (accessToken && refreshToken && session.status === 'authenticated') {
            handleRefreshTokens(accessToken, refreshToken);
        } else if (session.status === 'unauthenticated') {
            // If we're definitely not authenticated, redirect to login
            console.log('Session is unauthenticated, redirecting to login');
            router.push('/auth/login?error=Session+expired');
        } else if (session.status === 'loading' && !accessToken && !refreshToken) {
            // If session is still loading but we've checked a few times and don't have tokens,
            // set up a fallback timeout
            const fallbackTimer = setTimeout(() => {
                console.log('Session still loading after timeout, redirecting to login');
                router.push('/auth/login?error=Session+unavailable');
            }, 5000); // 5 second fallback
            
            return () => clearTimeout(fallbackTimer);
        }
    }, [session, router, redirectPath]);

    return (
        <div className="min-h-screen flex items-start justify-center dark:bg-gray-900 p-4 pt-16">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 p-8 mt-8">
                <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mb-5">
                        <ArrowPathIcon className="h-8 w-8 text-blue-700 dark:text-blue-400 animate-spin" />
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Refreshing Your Session
                    </h2>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Please wait while we update your permissions and access tokens...
                    </p>
                    
                    <div className="w-full space-y-3">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000 ease-in-out"
                                style={{ 
                                    width: `${isComplete ? 100 : loadingProgress}%` 
                                }}
                            ></div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                            <span>Validating credentials</span>
                            <span>{isComplete ? 'Complete!' : 'Almost there...'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}