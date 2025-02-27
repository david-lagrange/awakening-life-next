'use server';

import { resendConfirmationEmail, confirmEmail } from '@/app/lib/api/services/auth.service';

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

  try {
    await resendConfirmationEmail(email);
    return {
      message: 'success'
    };
  } catch (error) {
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
  try {
    console.log('confirmEmailWithToken', email, token);
    await confirmEmail(email, token);
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
} 