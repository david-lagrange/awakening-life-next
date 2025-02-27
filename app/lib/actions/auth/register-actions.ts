'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { register as registerApi, resendConfirmationEmail } from '@/app/lib/api/services/auth.service';

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
  const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }

  const { email, password } = validatedFields.data;
  
  try {
    const username = email.split('@')[0];
    const result = await registerApi({
      username,
      email,
      password,
      roles: [],
    });

    if (result.error) {
      console.log('register result (error)', result);
      return {
        message: result.error,
      };
    }

    // pause for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Send confirmation email automatically
    await resendConfirmationEmail(email);
    
    revalidatePath('/');
  } catch (error) {
    console.error('Error creating account:', error);
    return {
      message: 'Error creating account. Please try again.',
    };
  }

  // Move redirect outside of try-catch
  redirect('/auth/login?message=Account created successfully. Please sign in.');
} 