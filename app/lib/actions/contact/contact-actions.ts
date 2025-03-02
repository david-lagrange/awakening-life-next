'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sendContactForm } from '@/app/lib/api/services/contact.service';

const ContactFormSchema = z.object({
  name: z.string().min(1, { message: 'Please enter your name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(1, { message: 'Please enter a subject.' }),
  message: z.string().min(10, { message: 'Please enter a message (minimum 10 characters).' }),
});

export type ContactState = {
  errors: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
  message: string | null;
  success: boolean;
}

export async function sendContactMessage(prevState: ContactState, formData: FormData) {
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      success: false,
    };
  }

  const { name, email, subject, message } = validatedFields.data;
  
  try {
    const result = await sendContactForm({
      name,
      email,
      subject,
      message,
    });

    if (result.error) {
      console.error('Contact form submission error:', result.error);
      return {
        message: result.error,
        success: false,
        errors: {},
      };
    }

    revalidatePath('/contact');
    return {
      message: null,
      errors: {},
      success: true,
    };
  } catch (error) {
    console.error('Error sending contact message:', error);
    return {
      message: 'Error sending message. Please try again later.',
      success: false,
      errors: {},
    };
  }
} 