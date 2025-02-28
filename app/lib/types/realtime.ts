// Session types
export interface RealtimeSession {
  model: string;
  voice?: string;
  instructions?: string;
  tools?: RealtimeTool[];
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  turn_detection?: TurnDetection | null;
  input_audio_format?: AudioFormat;
  output_audio_format?: AudioFormat;
}

export interface TurnDetection {
  type: 'server_vad';
  create_response?: boolean;
  speech_threshold?: number;
  speech_timeout?: number;
  silence_threshold?: number;
  silence_timeout?: number;
}

export interface AudioFormat {
  type: 'wav' | 'mp3' | 'opus' | 'flac';
  sample_rate?: number;
  channels?: number;
  bit_depth?: number;
}

// Tool types
export interface RealtimeTool {
  type: 'function';
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, ToolParameter>;
    required?: string[];
  };
}

export interface ToolParameter {
  type: string;
  description?: string;
  enum?: string[];
  items?: {
    type: string;
    enum?: string[];
  };
}

// Event types
export interface ClientEvent {
  type: string;
  event_id?: string;
}

export interface SessionUpdateEvent extends ClientEvent {
  type: 'session.update';
  session: Partial<RealtimeSession>;
}

export interface ConversationItemCreateEvent extends ClientEvent {
  type: 'conversation.item.create';
  item: {
    type: 'message';
    role: 'user';
    content: Array<{
      type: 'input_text' | 'input_audio';
      text?: string;
      audio?: string;
    }>;
  };
}

export interface ResponseCreateEvent extends ClientEvent {
  type: 'response.create';
  response?: {
    modalities?: ('text' | 'audio')[];
    conversation?: 'default' | 'none';
    metadata?: Record<string, any>;
    instructions?: string;
    input?: any[];
    tools?: RealtimeTool[];
    tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
    input_audio_format?: AudioFormat;
    output_audio_format?: AudioFormat;
  };
}

export interface InputAudioBufferAppendEvent extends ClientEvent {
  type: 'input_audio_buffer.append';
  audio: string; // Base64-encoded audio
}

export interface InputAudioBufferCommitEvent extends ClientEvent {
  type: 'input_audio_buffer.commit';
}

export interface InputAudioBufferClearEvent extends ClientEvent {
  type: 'input_audio_buffer.clear';
}

export interface FunctionCallOutputEvent extends ClientEvent {
  type: 'conversation.item.create';
  item: {
    type: 'function_call_output';
    call_id: string;
    output: string; // JSON string
  };
}

// Server event types
export interface ServerEvent {
  type: string;
  event_id?: string;
}

export interface SessionCreatedEvent extends ServerEvent {
  type: 'session.created';
  session: RealtimeSession;
}

export interface SessionUpdatedEvent extends ServerEvent {
  type: 'session.updated';
  session: RealtimeSession;
}

export interface ResponseDoneEvent extends ServerEvent {
  type: 'response.done';
  response: {
    id: string;
    status: 'completed' | 'error' | 'cancelled';
    status_details: any;
    output: Array<{
      type: string;
      id: string;
      status: string;
      name?: string;
      call_id?: string;
      arguments?: string;
      content?: Array<{
        type: string;
        text?: string;
        audio?: string;
      }>;
    }>;
    usage: {
      total_tokens: number;
      input_tokens: number;
      output_tokens: number;
    };
    metadata: any;
  };
}

export interface ResponseTextDeltaEvent extends ServerEvent {
  type: 'response.text.delta';
  delta: {
    text: string;
  };
}

export interface ResponseAudioDeltaEvent extends ServerEvent {
  type: 'response.audio.delta';
  delta: {
    audio: string; // Base64-encoded audio
  };
}

export interface InputAudioBufferSpeechStartedEvent extends ServerEvent {
  type: 'input_audio_buffer.speech_started';
}

export interface InputAudioBufferSpeechStoppedEvent extends ServerEvent {
  type: 'input_audio_buffer.speech_stopped';
}

export interface ErrorEvent extends ServerEvent {
  type: 'error';
  code: string;
  message: string;
  param?: string;
}

// Function types
export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: string[];
    }>;
    required?: string[];
  };
  handler: (args: any) => Promise<any>;
}

// Chat message types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  timestamp: number;
  functionCall?: {
    name: string;
    arguments: string;
  };
  functionResult?: {
    name: string;
    result: string;
  };
} 