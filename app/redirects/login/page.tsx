'use client';

import { useEffect } from 'react';

export default function LoginRedirectPage() {
    useEffect(() => {
        window.location.href = '/dashboard';
    }, []);
    
    return null;
}