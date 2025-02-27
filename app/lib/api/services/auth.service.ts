import { auth } from "@/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const AUTH_PATH = `${API_BASE_URL}/api/authentication`;
const USERS_PATH = `${API_BASE_URL}/api/users`;

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface ResendConfirmationRequest {
  email: string;
}


export async function register(data: RegisterRequest): Promise<{ error?: string }> {
  const response = await fetch(AUTH_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log('register errorData', errorData);
    const errorMessages = Object.values(errorData)
      .flat()
      .join(', ');
    return { error: `Registration failed: ${errorMessages}` };
  }

  return {};
}

export async function resendConfirmationEmail(email: string): Promise<void> {
  const response = await fetch(`${USERS_PATH}/confirm-email-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`Failed to resend confirmation email: ${response.statusText}`);
  }
}

export async function confirmEmail(email: string, token: string): Promise<void> {
  //console.log('confirmEmail', email, token);
  const response = await fetch(`${USERS_PATH}/confirm-email`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, token: encodeURIComponent(token) }),
  });
  //console.log('confirmEmail response', response);
  if (!response.ok) {
    throw new Error(`Failed to confirm email: ${response.statusText}`);
  }
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  const response = await fetch(`${USERS_PATH}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send password reset email: ${response.statusText}`);
  }
}

export async function resetPasswordRequest(
  email: string, 
  token: string, 
  newPassword: string
): Promise<void> {
  const response = await fetch(`${USERS_PATH}/reset-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      email, 
      token: encodeURIComponent(token), 
      newPassword 
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to reset password: ${response.statusText}`);
  }
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${USERS_PATH}/update-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update password: ${response.statusText}`);
  }
} 