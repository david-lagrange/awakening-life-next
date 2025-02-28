'use client';

import { useState, useEffect, useRef } from 'react';
import { RealtimeApiService } from '@/app/lib/services/realtime-api-service';
import { 
  MicrophoneIcon, 
  SpeakerWaveIcon, 
  StopIcon, 
  ArrowPathIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon
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
  color?: string; // New prop for the circle color
}

export default function GuidedSession({
  title,
  description,
  systemPrompt,
  model = 'gpt-4o-2024-05-13',
  voice = 'alloy',
  tools = [],
  color = '#3B82F6', // Default to blue if no color provided
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  
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
      realtimeApi.on('connection', (event) => {
        console.log('Connection event:', event);
        handleConnectionEvent(event);
      });
      realtimeApi.on('error', (event) => {
        console.log('Error event:', event);
        handleErrorEvent(event);
      });
      realtimeApi.on('session.created', (event) => {
        console.log('Session created event:', event);
        handleSessionCreated(event);
      });
      realtimeApi.on('response.text.delta', (event) => {
        console.log('Text delta event:', event);
        handleTextDelta(event);
      });
      realtimeApi.on('response.audio.delta', (event) => {
        console.log('Audio delta event:', event);
        handleAudioDelta(event);
      });
      realtimeApi.on('response.done', (event) => {
        console.log('Response done event:', event);
        handleResponseDone(event);
      });
      realtimeApi.on('input_audio_buffer.speech_started', (event) => {
        console.log('Speech started event:', event);
        handleSpeechStarted(event);
      });
      realtimeApi.on('input_audio_buffer.speech_stopped', (event) => {
        console.log('Speech stopped event:', event);
        handleSpeechStopped(event);
      });
      realtimeApi.on('response.audio_transcript.delta', (event) => {
        console.log('Audio transcript delta event:', event);
        console.log('Delta value:', event.delta);
        handleAudioTranscriptDelta(event);
      });
      
      // Add a catch-all event listener to see ALL events
      realtimeApi.on('*', (event) => {
        console.log('Received event:', event);
      });
      
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
    console.log('Text delta:', event);

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
  
  // Add a new handler for audio transcript deltas
  const handleAudioTranscriptDelta = (event: any) => {
    console.log('Audio transcript delta:', event);

    // The delta is directly a string in this case
    const deltaText = typeof event.delta === 'string' ? event.delta : '';
    
    if (!deltaText) {
      console.error('Could not extract text from audio transcript delta:', event);
      return;
    }
    
    console.log('Extracted delta text:', deltaText);
    
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
          content: updatedMessages[messageIndex].content + deltaText,
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
            content: deltaText,
            isComplete: false,
          },
        ];
      }
    });
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
    console.log('Sending text message:', textInput);
    
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
    
    // Explicitly request a response with both text and audio modalities
    realtimeApiRef.current.createResponse({
      modalities: ["text", "audio"]
    });
    
    console.log('Response requested');
    
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

  // Toggle chat sidebar
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Main content with glowing circle */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        
        {/* Glowing circle */}
        <button
          onClick={isConnected ? toggleChat : initializeSession}
          disabled={isConnecting}
          className="relative group focus:outline-none mb-32"
          aria-label={isConnected ? "Toggle chat" : "Start session"}
        >
          <div 
            className={`w-32 h-32 rounded-full transition-all duration-300 flex items-center justify-center
              ${isConnected 
                ? `bg-opacity-80 shadow-lg` 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'}`}
            style={{
              backgroundColor: isConnected ? color : undefined,
              boxShadow: isConnected ? `0 0 30px ${color}` : undefined
            }}
          >
            {isConnecting ? (
              <ArrowPathIcon className="h-12 w-12 text-white animate-spin" />
            ) : isConnected ? (
              <div className="flex flex-col items-center">
                {isModelSpeaking ? (
                  <SpeakerWaveIcon className="h-12 w-12 text-white animate-pulse" />
                ) : isMicActive ? (
                  <MicrophoneIcon className="h-12 w-12 text-white animate-pulse" />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white bg-opacity-50 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-white text-sm font-medium">Start Session</div>
            )}
          </div>
          
          {isConnected && (
            <div className="absolute top-full mt-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
              {/* Microphone toggle button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMicrophone();
                }}
                className={`p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
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
              
              {/* Chat toggle button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleChat();
                }}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                  border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                aria-label="Toggle chat"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* End session button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  disconnectSession();
                }}
                className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 
                  border border-red-300 dark:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                aria-label="End session"
              >
                <StopIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </button>
        
        {error && (
          <div className="mt-8 max-w-md bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md p-4">
            <div className="flex items-start">
              <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}
        
        {apiUnavailable && (
          <div className="mt-8 max-w-md bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800 rounded-md p-4">
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
      </div>
      
      {/* Chat sidebar */}
      <div 
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 lg:w-96 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-300 dark:border-gray-700 
          transform transition-transform duration-300 ease-in-out z-40 flex flex-col
          ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Chat header */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900 dark:text-white">Conversation</h2>
          <button 
            onClick={toggleChat}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Close chat"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        
        {/* Chat messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-6">
              <ChatBubbleLeftRightIcon className="h-12 w-12 mb-4" aria-hidden="true" />
              <p className="text-lg font-medium">No messages yet</p>
              <p className="mt-2">Your conversation will appear here.</p>
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
        
        {/* Chat input */}
        {isConnected && (
          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-end space-x-2">
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
          </div>
        )}
      </div>
    </div>
  );
} 