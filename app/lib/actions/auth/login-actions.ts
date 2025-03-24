'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { createLogger } from '@/app/lib/logger';

// Create component-specific logger
const authLogger = createLogger('[SERVER] LoginActions');

export async function authenticate(
  prevState: "Invalid credentials." | "Something went wrong." | { success: boolean; } | undefined,
  formData: FormData,
) {
  const email = formData.get('email') as string;
  authLogger.info('Attempting to authenticate user', { email });
  
  try {
    const result = await signIn('credentials', {
      email: email,
      password: formData.get('password'),
      redirect: false,
    });
    
    if (result?.ok) {
      authLogger.info('User authenticated successfully', { email });
      return { success: true };
    }
    
    authLogger.warn('Authentication failed - invalid credentials', { email });
    return 'Invalid credentials.';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          authLogger.warn('Authentication failed - invalid credentials', { 
            email, 
            errorType: error.type 
          });
          return 'Invalid credentials.';
        default:
          authLogger.error('Authentication failed - unknown error', { 
            email, 
            errorType: error.type,
            error: error instanceof Error ? error.message : String(error)
          });
          return 'Something went wrong.';
      }
    }
    authLogger.error('Authentication failed - unexpected error', { 
      email, 
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

export async function refreshTokens(accessToken: string, refreshToken: string) {
  authLogger.info('Attempting to refresh tokens');
  
  try {
    const result = await signIn('credentials', {
      accessToken: accessToken,
      refreshToken: refreshToken,
      redirect: false,
    });

    if (result?.ok) {
      authLogger.info('Tokens refreshed successfully');
    } else {
      authLogger.warn('Token refresh failed');
    }
    
    return result;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          authLogger.warn('Token refresh failed - invalid credentials', { 
            errorType: error.type 
          });
          return 'Invalid credentials.';
        default:
          authLogger.error('Token refresh failed - unknown error', { 
            errorType: error.type,
            error: error instanceof Error ? error.message : String(error)
          });
          return 'Something went wrong.';
      }
    }
    authLogger.error('Token refresh failed - unexpected error', { 
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

export async function signOutAction() {
  authLogger.info('User signing out');
  
  try {
    await signOut({ redirect: false });
    await new Promise(resolve => setTimeout(resolve, 500));
    authLogger.info('User signed out successfully');
    return { success: true };
  } catch (error) {
    authLogger.error('Sign out failed', { 
      error: error instanceof Error ? error.message : String(error)
    });
    return { success: false };
  }
} 