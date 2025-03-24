'use server';

import { z } from 'zod';
import { resetPasswordRequest, sendPasswordResetEmail, updatePassword } from '@/app/lib/api/services/auth.service';
import { createLogger } from '@/app/lib/logger';

// Create component-specific logger
const passwordResetLogger = createLogger('[SERVER] PasswordResetActions');

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordResetState = {
  message: string | null;
  errors?: {
    email?: string[];
  };
};

export type ResetPasswordState = {
  message: string | null;
  errors?: {
    email?: string[];
    token?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export type ChangePasswordState = {
  message: string | null;
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
};

export async function sendPasswordReset(
  prevState: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const email = formData.get('email') as string;
  passwordResetLogger.info('Password reset email requested', { email });
  
  const validatedFields = schema.safeParse({
    email: email,
  });

  if (!validatedFields.success) {
    passwordResetLogger.warn('Password reset validation failed', { 
      email,
      errors: validatedFields.error.flatten().fieldErrors 
    });
    return {
      message: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await sendPasswordResetEmail(validatedFields.data.email);
    passwordResetLogger.info('Password reset email sent successfully', { email });
    return {
      message: 'success',
      errors: {},
    };
  } catch (error) {
    passwordResetLogger.error('Failed to send password reset email', { 
      email, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      message: 'Failed to send reset email. Please try again.',
      errors: {},
    };
  }
}

export async function resetPassword(
  prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const email = formData.get('email') as string;
  passwordResetLogger.info('Password reset requested', { email });
  
  const validatedFields = resetPasswordSchema.safeParse({
    email: email,
    token: formData.get('token'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    passwordResetLogger.warn('Password reset validation failed', { 
      email,
      errors: validatedFields.error.flatten().fieldErrors 
    });
    return {
      message: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await resetPasswordRequest(
      validatedFields.data.email,
      validatedFields.data.token,
      validatedFields.data.password
    );
    passwordResetLogger.info('Password reset completed successfully', { email });
    return {
      message: 'success',
      errors: {},
    };
  } catch (error) {
    passwordResetLogger.error('Failed to reset password', { 
      email, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      message: 'Failed to reset password. Please try again.',
      errors: {},
    };
  }
}

export async function changePassword(
  prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  passwordResetLogger.info('Password change requested');
  
  const validatedFields = changePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    passwordResetLogger.warn('Password change validation failed', { 
      errors: validatedFields.error.flatten().fieldErrors 
    });
    return {
      message: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await updatePassword(
      validatedFields.data.currentPassword,
      validatedFields.data.newPassword
    );
    passwordResetLogger.info('Password changed successfully');
    return {
      message: 'success',
      errors: {},
    };
  } catch (error) {
    passwordResetLogger.error('Failed to change password', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      message: 'Failed to update password. Please check your current password and try again.',
      errors: {},
    };
  }
} 