'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { register as registerApi, resendConfirmationEmail } from '@/app/lib/api/services/auth.service';
import { createLogger } from '@/app/lib/logger';

// Create component-specific logger
const registerLogger = createLogger('[SERVER] RegisterActions');

const RegisterFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
}

export async function register(prevState: RegisterState, formData: FormData) {
  const email = formData.get('email') as string;
  registerLogger.info('User registration attempt', { email });
  
  const validatedFields = RegisterFormSchema.safeParse({
    email: email,
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    registerLogger.warn('Registration validation failed', { 
      email, 
      errors: validatedFields.error.flatten().fieldErrors 
    });
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }

  const { email: validatedEmail, password } = validatedFields.data;
  
  try {
    const username = validatedEmail.split('@')[0];
    registerLogger.info('Attempting to register user with API', { 
      email: validatedEmail, 
      username 
    });
    
    const result = await registerApi({
      username,
      email: validatedEmail,
      password,
      roles: [],
    });

    if (result.error) {
      registerLogger.warn('Registration failed with API error', { 
        email: validatedEmail, 
        error: result.error 
      });
      return {
        message: result.error,
      };
    }

    registerLogger.info('User registered successfully', { email: validatedEmail });
    
    // pause for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Send confirmation email automatically
    registerLogger.info('Sending confirmation email', { email: validatedEmail });
    await resendConfirmationEmail(validatedEmail);
    registerLogger.info('Confirmation email sent successfully', { email: validatedEmail });
    
    revalidatePath('/');
  } catch (error) {
    registerLogger.error('Error during registration process', { 
      email: validatedEmail, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      message: 'Error creating account. Please try again.',
    };
  }

  registerLogger.info('Registration completed, redirecting to login', { email: validatedEmail });
  // Move redirect outside of try-catch
  redirect('/auth/login?message=Account created successfully. Please sign in.');
} 