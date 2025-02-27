'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: "Invalid credentials." | "Something went wrong." | { success: boolean; } | undefined,
  formData: FormData,
) {
  try {
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });
    
    if (result?.ok) {
      return { success: true };
    }
    return 'Invalid credentials.';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function refreshTokens(accessToken: string, refreshToken: string) {
  try {
    const result = await signIn('credentials', {
      accessToken: accessToken,
      refreshToken: refreshToken,
      redirect: false,
    
    });

    return result;
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function signOutAction() {
  try {
    await signOut({ redirect: false });
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  } catch (error) {
    console.error('Signout error:', error);
    return { success: false };
  }
} 