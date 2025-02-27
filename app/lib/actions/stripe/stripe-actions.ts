'use server';

import { auth } from '@/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStripeCustomerId(): Promise<string> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/stripe/customers`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch customer: ${response.statusText}`);
  }

  const data = await response.json();
  return data.customerId;
}