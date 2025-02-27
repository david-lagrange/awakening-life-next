import { auth } from '@/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const USERS_PATH = `${API_BASE_URL}/api/users`;

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userName: string;
  email: string;
  phoneNumber: string | null;
  roles: string[];
  subscriptionType: number;
}

export async function getCurrentUser(): Promise<User> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${USERS_PATH}`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  return response.json();
}

export async function updateUser(userData: Partial<User>): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${USERS_PATH}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user profile: ${response.statusText}`);
  }
} 