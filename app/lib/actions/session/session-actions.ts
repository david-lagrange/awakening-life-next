'use server';

import { z } from 'zod';
import { createLogger } from '@/app/lib/logger';
import { 
  getAllSessions,
  getSessionById,
  getSessionsByType,
  createSession,
  updateSession,
  deleteSession,
  completeSession,
  type SessionDto,
  type SessionForCreationDto,
  type SessionForUpdateDto
} from '@/app/lib/api/services/sessions.service';

// Create component-specific logger
const sessionLogger = createLogger('[SERVER] SessionActions');

// Zod schemas
const SessionCreationSchema = z.object({
  type: z.string().min(1, { message: 'Session type is required' }).nullable(),
});

const SessionUpdateSchema = z.object({
  type: z.string().min(1, { message: 'Session type is required' }).nullable(),
  completedAt: z.string().datetime().nullable(),
});

// State types
export type SessionState = {
  error?: string;
  session?: SessionDto;
  sessions?: SessionDto[];
}

export type SessionFormState = {
  message?: string;
  success?: boolean;
  errors?: {
    type?: string[];
    completedAt?: string[];
  };
}

// Action functions
export async function fetchAllSessions(): Promise<SessionState> {
  try {
    sessionLogger.info('Fetching all sessions');
    const sessions = await getAllSessions();
    return { sessions };
  } catch (error) {
    sessionLogger.error('Error fetching sessions', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      error: 'Failed to load sessions. Please try again later.',
    };
  }
}

export async function fetchSessionById(id: string): Promise<SessionState> {
  try {
    sessionLogger.info('Fetching session by ID', { sessionId: id });
    const session = await getSessionById(id);
    return { session };
  } catch (error) {
    sessionLogger.error('Error fetching session by ID', { 
      sessionId: id,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      error: 'Failed to load session details. Please try again later.',
    };
  }
}

export async function fetchSessionsByType(type: string): Promise<SessionState> {
  try {
    sessionLogger.info('Fetching sessions by type', { type });
    const sessions = await getSessionsByType(type);
    return { sessions };
  } catch (error) {
    sessionLogger.error('Error fetching sessions by type', { 
      type,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      error: 'Failed to load sessions. Please try again later.',
    };
  }
}

export async function createNewSession(prevState: SessionFormState, formData: FormData): Promise<SessionFormState & { sessionId?: string }> {
  try {
    const sessionData = {
      type: formData.get('type') as string,
    };

    sessionLogger.info('Creating new session', { sessionData });

    // Validate with Zod
    const validationResult = SessionCreationSchema.safeParse(sessionData);
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      sessionLogger.warn('Session validation failed', { errors });
      return { 
        errors: errors as SessionFormState['errors'],
        message: 'Please correct the errors below.',
        success: false
      };
    }

    // Submit session to API
    const createdSession = await createSession(sessionData as SessionForCreationDto);
    
    sessionLogger.info('Session created successfully', { sessionId: createdSession.sessionId });
    return { 
      message: 'Session created successfully',
      success: true,
      sessionId: createdSession.sessionId
    };
  } catch (error) {
    sessionLogger.error('Error creating session', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      message: 'Failed to create session. Please try again later.',
      success: false
    };
  }
}

export async function updateExistingSession(id: string, prevState: SessionFormState, formData: FormData): Promise<SessionFormState> {
  try {
    const sessionData = {
      type: formData.get('type') as string,
      completedAt: formData.get('completedAt') as string,
    };

    sessionLogger.info('Updating session', { sessionId: id, sessionData });

    // Validate with Zod
    const validationResult = SessionUpdateSchema.safeParse(sessionData);
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      sessionLogger.warn('Session update validation failed', { 
        sessionId: id,
        errors 
      });
      return { 
        errors: errors as SessionFormState['errors'],
        message: 'Please correct the errors below.',
        success: false
      };
    }

    // Submit session update to API
    await updateSession(id, sessionData as SessionForUpdateDto);
    
    sessionLogger.info('Session updated successfully', { sessionId: id });
    return { 
      message: 'Session updated successfully',
      success: true
    };
  } catch (error) {
    sessionLogger.error('Error updating session', { 
      sessionId: id,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      message: 'Failed to update session. Please try again later.',
      success: false
    };
  }
}

export async function removeSession(id: string): Promise<SessionState> {
  try {
    sessionLogger.info('Removing session', { sessionId: id });
    await deleteSession(id);
    
    sessionLogger.info('Session deleted successfully', { sessionId: id });
    return { error: 'Session deleted successfully' };
  } catch (error) {
    sessionLogger.error('Error deleting session', { 
      sessionId: id,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      error: 'Failed to delete session. Please try again later.',
    };
  }
}

export async function markSessionComplete(id: string): Promise<SessionState> {
  try {
    sessionLogger.info('Marking session as complete', { sessionId: id });
    await completeSession(id);
    
    sessionLogger.info('Session marked as complete', { sessionId: id });
    return { 
      error: 'Session completed successfully'
    };
  } catch (error) {
    sessionLogger.error('Error completing session', { 
      sessionId: id,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      error: 'Failed to complete session. Please try again later.',
    };
  }
} 