'use server';

import { z } from 'zod';
import { addToWaitlist } from '@/app/lib/api/services/waitlist.service';

const WaitlistFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type WaitlistState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
  success?: boolean;
}

export async function joinWaitlist(prevState: WaitlistState, formData: FormData) {
  const validatedFields = WaitlistFormSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please enter a valid email address.',
      success: false,
    };
  }

  const { email } = validatedFields.data;
  
  try {
    const result = await addToWaitlist({
      email,
    });

    if (result.error) {
      console.log('waitlist result (error)', result);
      return {
        message: result.error,
        success: false,
      };
    }

    return {
      message: 'Thank you! You have been added to our waitlist.',
      success: true,
    };
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return {
      message: 'Error joining waitlist. Please try again.',
      success: false,
    };
  }
} 