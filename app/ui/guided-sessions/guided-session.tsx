'use client';

import { useState, useEffect, useRef } from 'react';
import { RealtimeApiService } from '@/app/lib/services/realtime-api-service';
import { 
  MicrophoneIcon, 
  SpeakerWaveIcon, 
  StopIcon, 
  ArrowPathIcon,
  XCircleIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isComplete: boolean;
}

interface GuidedSessionProps {
  title: string;
  description: string;
  systemPrompt: string;
  model?: string;
  voice?: string;
  tools?: any[];
}

export default function GuidedSession({
  title,
  description,
  systemPrompt,
  model = 'gpt-4o-2024-05-13',
  voice = 'alloy',
  tools = [],
}: GuidedSessionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  
  const realtimeApiRef = useRef<RealtimeApiService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Initialize Realtime API service
  const initializeSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setApiUnavailable(false);
      
      // First, check if we have microphone permissions
      try {
        // Request microphone access before creating the service
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately, we just needed to check permissions
        stream.getTracks().forEach(track => track.stop());
      } catch (micError) {
        console.error('Microphone permission error:', micError);
        setError('Microphone access is required for this feature. Please allow microphone access and try again.');
        setIsConnecting(false);
        return;
      }
      
      // Create new instance to ensure clean state
      const realtimeApi = new RealtimeApiService();
      realtimeApiRef.current = realtimeApi;
      
      // Set up event listeners
      realtimeApi.on('connection', handleConnectionEvent);
      realtimeApi.on('error', handleErrorEvent);
      realtimeApi.on('session.created', handleSessionCreated);
      realtimeApi.on('response.text.delta', handleTextDelta);
      realtimeApi.on('response.audio.delta', handleAudioDelta);
      realtimeApi.on('response.done', handleResponseDone);
      realtimeApi.on('input_audio_buffer.speech_started', handleSpeechStarted);
      realtimeApi.on('input_audio_buffer.speech_stopped', handleSpeechStopped);
      
      // Initialize the service
      await realtimeApi.initialize({
        model,
        voice,
        systemPrompt,
      });
      
      // Configure tools if provided
      if (tools && tools.length > 0) {
        realtimeApi.updateSession({
          tools,
          tool_choice: 'auto',
        });
      }
      
    } catch (error) {
      console.error('Failed to initialize session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if the error is related to the API being unavailable
      if (errorMessage.includes('400') || errorMessage.includes('404') || errorMessage.includes('not found')) {
        setApiUnavailable(true);
        setError('The Realtime API is currently unavailable or the model specified is not accessible. Please try again later or contact support.');
      } else {
        setError(`Failed to connect to the AI assistant: ${errorMessage}`);
      }
      
      setIsConnecting(false);
    }
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (realtimeApiRef.current) {
        realtimeApiRef.current.cleanup();
      }
    };
  }, []);
  
  // Event handlers
  const handleConnectionEvent = (event: any) => {
    if (event.status === 'connected') {
      setIsConnected(true);
      setIsConnecting(false);
      
      // Add welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! I\'m here to guide you through this session. You can speak to me or type your messages.',
          isComplete: true,
        },
      ]);
    }
  };
  
  const handleErrorEvent = (event: any) => {
    console.error('Realtime API error:', event.error);
    const errorMessage = event.error instanceof Error 
      ? event.error.message 
      : (typeof event.error === 'string' ? event.error : 'Unknown error');
    
    setError(`An error occurred with the AI assistant: ${errorMessage}`);
    setIsConnecting(false);
  };
  
  const handleSessionCreated = (event: any) => {
    console.log('Session created:', event);
  };
  
  const handleTextDelta = (event: any) => {
    const delta = event.delta.text;
    
    setMessages(prevMessages => {
      // Find if we already have a message for this response
      const messageIndex = prevMessages.findIndex(
        msg => msg.id === currentMessageIdRef.current && msg.role === 'assistant'
      );
      
      if (messageIndex >= 0) {
        // Update existing message
        const updatedMessages = [...prevMessages];
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          content: updatedMessages[messageIndex].content + delta,
        };
        return updatedMessages;
      } else {
        // Create new message
        const newMessageId = `msg_${Date.now()}`;
        currentMessageIdRef.current = newMessageId;
        return [
          ...prevMessages,
          {
            id: newMessageId,
            role: 'assistant',
            content: delta,
            isComplete: false,
          },
        ];
      }
    });
  };
  
  const handleAudioDelta = (event: any) => {
    // Audio is handled automatically by WebRTC, but we can track when audio is playing
    setIsModelSpeaking(true);
  };
  
  const handleResponseDone = (event: any) => {
    setIsModelSpeaking(false);
    setIsProcessing(false);
    
    // Mark current message as complete
    if (currentMessageIdRef.current) {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === currentMessageIdRef.current
            ? { ...msg, isComplete: true }
            : msg
        )
      );
      currentMessageIdRef.current = null;
    }
  };
  
  const handleSpeechStarted = (event: any) => {
    // User started speaking
    if (!messages.some(msg => msg.role === 'user' && !msg.isComplete)) {
      // Add a new user message if one doesn't exist
      const newMessageId = `msg_${Date.now()}`;
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: newMessageId,
          role: 'user',
          content: '🎤 Speaking...',
          isComplete: false,
        },
      ]);
    }
  };
  
  const handleSpeechStopped = (event: any) => {
    // User stopped speaking
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.role === 'user' && !msg.isComplete
          ? { ...msg, content: '🎤 Processing...', isComplete: true }
          : msg
      )
    );
  };
  
  // User actions
  const toggleMicrophone = () => {
    if (!realtimeApiRef.current) return;
    
    try {
      // Toggle microphone state
      realtimeApiRef.current.toggleMicrophone(!isMicActive);
      setIsMicActive(!isMicActive);
    } catch (error) {
      console.error('Microphone error:', error);
      setError('Failed to access microphone. Please check your permissions and try again.');
    }
  };
  
  const sendTextMessage = () => {
    if (!textInput.trim() || !realtimeApiRef.current || isProcessing) return;
    
    setIsProcessing(true);
    
    // Add user message
    const newMessageId = `msg_${Date.now()}`;
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: newMessageId,
        role: 'user',
        content: textInput,
        isComplete: true,
      },
    ]);
    
    // Send message to API
    realtimeApiRef.current.sendTextMessage(textInput);
    realtimeApiRef.current.createResponse();
    
    // Clear input
    setTextInput('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };
  
  const disconnectSession = () => {
    if (realtimeApiRef.current) {
      realtimeApiRef.current.cleanup();
      realtimeApiRef.current = null;
    }
    setIsConnected(false);
    setIsMicActive(false);
    setIsModelSpeaking(false);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-300 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </div>
          
          {!isConnected ? (
            <button
              onClick={initializeSession}
              disabled={isConnecting}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md
                text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {isConnecting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                  Connecting...
                </>
              ) : (
                'Start Session'
              )}
            </button>
          ) : (
            <button
              onClick={disconnectSession}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md
                text-white bg-red-600 hover:bg-red-700
                transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/40"
            >
              <StopIcon className="h-4 w-4 mr-2" aria-hidden="true" />
              End Session
            </button>
          )}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isConnected && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-6">
            <SpeakerWaveIcon className="h-12 w-12 mb-4" aria-hidden="true" />
            <p className="text-lg font-medium">Start a guided session</p>
            <p className="mt-2">Click the "Start Session" button to begin your guided experience.</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}
        
        {apiUnavailable && (
          <div className="bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Realtime API Unavailable</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  The OpenAI Realtime API may not be available in your region or account. Please check your OpenAI account access or try a different model.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {!message.isComplete && (
                <div className="mt-1 flex justify-end">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      {isConnected && (
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <div className="flex items-end space-x-2">
            <button
              onClick={toggleMicrophone}
              className={`flex-shrink-0 p-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                isMicActive 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
              aria-label={isMicActive ? 'Stop speaking' : 'Start speaking'}
            >
              {isMicActive ? (
                <StopIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <MicrophoneIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            
            <div className="flex-grow relative">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                  px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent
                  resize-none"
                disabled={isProcessing}
              />
            </div>
            
            <button
              onClick={sendTextMessage}
              disabled={!textInput.trim() || isProcessing}
              className="flex-shrink-0 p-2.5 rounded-full bg-blue-600 text-white 
                hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              {isModelSpeaking && (
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <SpeakerWaveIcon className="h-3.5 w-3.5 mr-1 animate-pulse" aria-hidden="true" />
                  <span>AI speaking...</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isMicActive ? (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-pulse"></div>
                  <span>Microphone active</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 