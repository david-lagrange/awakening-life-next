const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const WAITLIST_PATH = `${API_BASE_URL}/api/waitlist`;

export interface WaitlistRequest {
  email: string;
}

export async function addToWaitlist(data: WaitlistRequest): Promise<{ error?: string }> {
  try {
    const response = await fetch(WAITLIST_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('waitlist errorData', errorData);
      const errorMessages = Object.values(errorData)
        .flat()
        .join(', ');
      return { error: `Failed to join waitlist: ${errorMessages}` };
    }

    return {};
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return { error: 'Network error. Please try again later.' };
  }
} 