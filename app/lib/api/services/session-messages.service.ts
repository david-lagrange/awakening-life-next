import { auth } from '@/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const SESSIONS_PATH = `${API_BASE_URL}/api/sessions`;

export interface SessionMessageDto {
  sessionMessageId: string;
  message: string | null;
  role: string | null;
  weight: number | null;
  timestamp: string;
  sessionId: string;
}

export interface SessionMessageForCreationDto {
  message: string | null;
  role: string | null;
  weight: number | null;
}

export interface SessionMessageForUpdateDto {
  message: string | null;
  role: string | null;
  weight: number | null;
}

export async function getAllSessionMessages(sessionId: string): Promise<SessionMessageDto[]> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }
  
  const response = await fetch(`${SESSIONS_PATH}/${sessionId}/messages`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch session messages: ${response.statusText}`);
  }

  return response.json();
}

export async function getSessionMessageById(sessionId: string, id: string): Promise<SessionMessageDto> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}/${sessionId}/messages/${id}`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch session message: ${response.statusText}`);
  }

  return response.json();
}

export async function createSessionMessage(
  sessionId: string, 
  sessionMessageData: SessionMessageForCreationDto
): Promise<SessionMessageDto> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionMessageData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create session message: ${response.statusText}`);
  }

  return response.json();
}

export async function updateSessionMessage(
  sessionId: string,
  id: string, 
  sessionMessageData: SessionMessageForUpdateDto
): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}/${sessionId}/messages/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionMessageData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update session message: ${response.statusText}`);
  }
}

export async function deleteSessionMessage(sessionId: string, id: string): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}/${sessionId}/messages/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete session message: ${response.statusText}`);
  }
} 