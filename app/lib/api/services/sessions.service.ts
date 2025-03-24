import { auth } from '@/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const SESSIONS_PATH = `${API_BASE_URL}/api/sessions`;

export interface SessionDto {
  sessionId: string;
  type: string | null;
  completedAt: string | null;
  startedAt: string;
  userId: string;
}

export interface SessionForCreationDto {
  type: string | null;
}

export interface SessionForUpdateDto {
  type: string | null;
  completedAt: string | null;
}

export async function getAllSessions(): Promise<SessionDto[]> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }
  
  const response = await fetch(`${SESSIONS_PATH}`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sessions: ${response.statusText}`);
  }

  return response.json();
}

export async function getSessionById(id: string): Promise<SessionDto> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}/${id}`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch session: ${response.statusText}`);
  }

  return response.json();
}

export async function getSessionsByType(type: string): Promise<SessionDto[]> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}/type/${type}`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sessions by type: ${response.statusText}`);
  }

  return response.json();
}

export async function createSession(sessionData: SessionForCreationDto): Promise<SessionDto> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.statusText}`);
  }

  return response.json();
}

export async function updateSession(id: string, sessionData: SessionForUpdateDto): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update session: ${response.statusText}`);
  }
}

export async function deleteSession(id: string): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete session: ${response.statusText}`);
  }
}

export async function completeSession(id: string): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${SESSIONS_PATH}/${id}/complete`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to complete session: ${response.statusText}`);
  }
} 