const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CONTACT_PATH = `${API_BASE_URL}/api/contact`;

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactForm(data: ContactRequest): Promise<{ error?: string }> {
  try {
    const response = await fetch(CONTACT_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Contact form submission error:', errorData);
      
      const errorMessages = typeof errorData === 'object' && errorData !== null
        ? Object.values(errorData).flat().join(', ')
        : 'Failed to send message. Please try again later.';
        
      return { error: errorMessages };
    }

    return {};
  } catch (error) {
    console.error('Error in contact service:', error);
    return { error: 'Network error. Please check your connection and try again.' };
  }
} 