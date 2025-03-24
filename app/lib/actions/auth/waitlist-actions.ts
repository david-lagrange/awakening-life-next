'use server';

import { z } from 'zod';
import { addToWaitlist } from '@/app/lib/api/services/waitlist.service';
import { createLogger } from '@/app/lib/logger';

// Create component-specific logger
const waitlistLogger = createLogger('[SERVER] WaitlistActions');

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
  const email = formData.get('email') as string;
  waitlistLogger.info('Waitlist join request received', { email });
  
  const validatedFields = WaitlistFormSchema.safeParse({
    email: email,
  });

  if (!validatedFields.success) {
    waitlistLogger.warn('Waitlist validation failed', { 
      email, 
      errors: validatedFields.error.flatten().fieldErrors 
    });
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please enter a valid email address.',
      success: false,
    };
  }

  const { email: validatedEmail } = validatedFields.data;
  
  try {
    waitlistLogger.info('Attempting to add email to waitlist', { email: validatedEmail });
    
    const result = await addToWaitlist({
      email: validatedEmail,
    });

    if (result.error) {
      waitlistLogger.warn('Waitlist addition failed', { 
        email: validatedEmail, 
        error: result.error 
      });
      return {
        message: result.error,
        success: false,
      };
    }

    waitlistLogger.info('Email successfully added to waitlist', { email: validatedEmail });
    return {
      message: 'Thank you! You have been added to our waitlist.',
      success: true,
    };
  } catch (error) {
    waitlistLogger.error('Error adding to waitlist', { 
      email: validatedEmail, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      message: 'Error joining waitlist. Please try again.',
      success: false,
    };
  }
} 