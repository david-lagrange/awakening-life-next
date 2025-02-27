'use client';

import { useEffect } from 'react';

export default function LoginRedirectPage() {
    useEffect(() => {
        window.location.href = '/';
    }, []);
    
    return null;
}