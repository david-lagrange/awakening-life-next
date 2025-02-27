'use client';

import { signOutAction } from '@/app/lib/actions/auth/login-actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignoutCreateAccountRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        const handleSignOut = async () => {
            try {
                const result = await signOutAction();
                if (result.success) {
                    window.location.href = '/auth/create-account';
                } else {
                    window.location.href = '/auth/create-account';
                }
            } catch (error) {
                console.error('Error during sign out:', error);
                window.location.href = '/auth/create-account';
            }
        };
        
        handleSignOut();
    }, [router]);

    return null;
}