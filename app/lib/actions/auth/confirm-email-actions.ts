'use server';

import { resendConfirmationEmail, confirmEmail } from '@/app/lib/api/services/auth.service';
import { createLogger } from '@/app/lib/logger';

// Create component-specific logger
const authActionLogger = createLogger('[SERVER] ConfirmEmailActions');

export type EmailConfirmationState = {
  message?: string | null;
  errors?: {
    email?: string[];
  };
};

export async function resendConfirmation(
  prevState: EmailConfirmationState,
  formData: FormData
) {
  const email = formData.get('email') as string;
  
  authActionLogger.info('Attempting to resend confirmation email', { email });

  try {
    await resendConfirmationEmail(email);
    authActionLogger.info('Confirmation email resent successfully', { email });
    return {
      message: 'success'
    };
  } catch (error) {
    authActionLogger.error('Failed to resend confirmation email', { 
      email, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      errors: {
        email: [(error as Error).message]
      }
    };
  }
}

export type EmailConfirmationResult = {
  success?: boolean;
  error?: string;
};

export async function confirmEmailWithToken(
  email: string,
  token: string
): Promise<EmailConfirmationResult> {
  authActionLogger.info('Confirming email with token', { email });
  
  try {
    await confirmEmail(email, token);
    authActionLogger.info('Email confirmed successfully', { email });
    return { success: true };
  } catch (error) {
    authActionLogger.error('Failed to confirm email', { 
      email, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { error: (error as Error).message };
  }
} 