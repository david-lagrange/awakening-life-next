'use client';

import { useEffect } from 'react';
import { signOutAction } from '@/app/lib/actions/auth/login-actions';
import { useSession } from 'next-auth/react';

export default function LogoutRedirectPage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        const handleLogout = async () => {
            if (session) {
                await signOutAction();
            }
            window.location.href = '/';
        };
        
        if (status !== 'loading') {
            handleLogout();
        }
    }, [session, status]);
    
    return null;
}