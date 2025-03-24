'use server';

import { z } from 'zod';
import { createLogger } from '@/app/lib/logger';
import { 
  getAllSessionMessages,
  getSessionMessageById,
  createSessionMessage,
  updateSessionMessage,
  deleteSessionMessage,
  type SessionMessageDto,
  type SessionMessageForCreationDto,
  type SessionMessageForUpdateDto
} from '@/app/lib/api/services/session-messages.service';

// Create component-specific logger
const sessionMessageLogger = createLogger('[SERVER] SessionMessageActions');

// Zod schemas
const SessionMessageCreationSchema = z.object({
  message: z.string().min(1, { message: 'Message is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  weight: z.number().nullable().optional(),
});

const SessionMessageUpdateSchema = z.object({
  message: z.string().min(1, { message: 'Message is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  weight: z.number().nullable().optional(),
});

// State types
export type SessionMessageState = {
  error?: string;
  sessionMessage?: SessionMessageDto;
  sessionMessages?: SessionMessageDto[];
}

export type SessionMessageFormState = {
  message?: string;
  success?: boolean;
  errors?: {
    message?: string[];
    role?: string[];
    weight?: string[];
  };
}

// Action functions
export async function fetchAllSessionMessages(sessionId: string): Promise<SessionMessageState> {
  try {
    sessionMessageLogger.info('Fetching all session messages', { sessionId });
    const sessionMessages = await getAllSessionMessages(sessionId);
    return { sessionMessages };
  } catch (error) {
    sessionMessageLogger.error('Error fetching session messages', { 
      sessionId,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      error: 'Failed to load session messages. Please try again later.',
    };
  }
}

export async function fetchSessionMessageById(sessionId: string, id: string): Promise<SessionMessageState> {
  try {
    sessionMessageLogger.info('Fetching session message by ID', { sessionId, messageId: id });
    const sessionMessage = await getSessionMessageById(sessionId, id);
    return { sessionMessage };
  } catch (error) {
    sessionMessageLogger.error('Error fetching session message by ID', { 
      sessionId,
      messageId: id,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      error: 'Failed to load session message details. Please try again later.',
    };
  }
}

export async function createNewSessionMessage(
  sessionId: string, 
  prevState: SessionMessageFormState, 
  formData: FormData
): Promise<SessionMessageFormState & { sessionMessageId?: string }> {
  try {
    const sessionMessageData = {
      message: formData.get('message') as string,
      role: formData.get('role') as string,
      weight: formData.get('weight') ? parseInt(formData.get('weight') as string) : null,
    };

    sessionMessageLogger.info('Creating new session message', { sessionId, sessionMessageData });

    // Validate with Zod
    const validationResult = SessionMessageCreationSchema.safeParse(sessionMessageData);
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      sessionMessageLogger.warn('Session message validation failed', { errors });
      return { 
        errors: errors as SessionMessageFormState['errors'],
        message: 'Please correct the errors below.',
        success: false
      };
    }

    // Submit session message to API
    const createdSessionMessage = await createSessionMessage(sessionId, sessionMessageData as SessionMessageForCreationDto);
    
    sessionMessageLogger.info('Session message created successfully', { 
      sessionId, 
      sessionMessageId: createdSessionMessage.sessionMessageId 
    });
    return { 
      message: 'Session message created successfully',
      success: true,
      sessionMessageId: createdSessionMessage.sessionMessageId
    };
  } catch (error) {
    sessionMessageLogger.error('Error creating session message', { 
      sessionId,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      message: 'Failed to create session message. Please try again later.',
      success: false
    };
  }
}

export async function updateExistingSessionMessage(
  sessionId: string,
  id: string, 
  prevState: SessionMessageFormState, 
  formData: FormData
): Promise<SessionMessageFormState> {
  try {
    const sessionMessageData = {
      message: formData.get('message') as string,
      role: formData.get('role') as string,
      weight: formData.get('weight') ? parseInt(formData.get('weight') as string) : null,
    };

    sessionMessageLogger.info('Updating session message', { 
      sessionId, 
      sessionMessageId: id, 
      sessionMessageData 
    });

    // Validate with Zod
    const validationResult = SessionMessageUpdateSchema.safeParse(sessionMessageData);
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      sessionMessageLogger.warn('Session message update validation failed', { 
        sessionId,
        sessionMessageId: id,
        errors 
      });
      return { 
        errors: errors as SessionMessageFormState['errors'],
        message: 'Please correct the errors below.',
        success: false
      };
    }

    // Submit session message update to API
    await updateSessionMessage(sessionId, id, sessionMessageData as SessionMessageForUpdateDto);
    
    sessionMessageLogger.info('Session message updated successfully', { 
      sessionId, 
      sessionMessageId: id 
    });
    return { 
      message: 'Session message updated successfully',
      success: true
    };
  } catch (error) {
    sessionMessageLogger.error('Error updating session message', { 
      sessionId,
      sessionMessageId: id,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      message: 'Failed to update session message. Please try again later.',
      success: false
    };
  }
}

export async function removeSessionMessage(sessionId: string, id: string): Promise<SessionMessageState> {
  try {
    sessionMessageLogger.info('Removing session message', { sessionId, sessionMessageId: id });
    await deleteSessionMessage(sessionId, id);
    
    sessionMessageLogger.info('Session message deleted successfully', { 
      sessionId, 
      sessionMessageId: id 
    });
    return { error: 'Session message deleted successfully' };
  } catch (error) {
    sessionMessageLogger.error('Error deleting session message', { 
      sessionId,
      sessionMessageId: id,
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      error: 'Failed to delete session message. Please try again later.',
    };
  }
} 