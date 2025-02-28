'use client';

import { useState, useRef, useEffect } from 'react';
import { useRealtimeApi } from '@/app/hooks/useRealtimeApi';
import ChatMessageComponent from './chat-message';
import StreamingMessage from './streaming-message';
import { FunctionDefinition, RealtimeSession } from '@/app/lib/types/realtime';
import { MicrophoneIcon, PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/solid';

interface ChatInterfaceProps {
  model: string;
  voice?: string;
  initialInstructions?: string;
  functions?: FunctionDefinition[];
  autoConnect?: boolean;
  sessionConfig?: Partial<RealtimeSession>;
}

export default function ChatInterface({
  model,
  voice,
  initialInstructions,
  functions = [],
  autoConnect = false,
  sessionConfig,
}: ChatInterfaceProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add autoConnectRef at the component level, not inside useEffect
  const autoConnectRef = useRef(false);
  
  // Add a mounted ref to track component lifecycle
  const mountedRef = useRef(true);
  
  // Log component initialization
  console.log('ChatInterface component initialized');
  
  const {
    isConnecting,
    isConnected,
    error: apiError,
    messages,
    currentAssistantMessage,
    sendUserMessage,
    startSession,
    endSession,
    isSpeaking,
    isListening,
    isProcessing,
    audioElement,
    updateSessionConfig,
  } = useRealtimeApi({
    model,
    voice,
    initialInstructions,
    functions,
    autoConnect: false,
  });
  
  // Local error state for UI-specific errors
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Combine API errors and local errors
  const error = apiError || localError;
  
  // Check WebRTC capabilities when component mounts
  useEffect(() => {
    const checkWebRTCCapabilities = async () => {
      try {
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setLocalError('Your browser does not support audio input required for this feature.');
          return false;
        }
        
        // Check if RTCPeerConnection is supported
        if (!window.RTCPeerConnection) {
          setLocalError('Your browser does not support WebRTC required for this feature.');
          return false;
        }
        
        // Try to access the microphone
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop all tracks immediately after test
          stream.getTracks().forEach(track => track.stop());
          console.log('Microphone access test successful');
          return true;
        } catch (err) {
          console.error('Error accessing microphone:', err);
          setLocalError('Could not access microphone. Please ensure microphone permissions are granted.');
          return false;
        }
      } catch (error) {
        console.error('Error checking WebRTC capabilities:', error);
        setLocalError(`WebRTC capability check failed: ${error instanceof Error ? error.message : String(error)}`);
        return false;
      }
    };
    
    checkWebRTCCapabilities();
  }, []);
  
  // Apply session config if provided
  useEffect(() => {
    let configUpdateTimeout: NodeJS.Timeout;
    
    if (isConnected && sessionConfig) {
      // Add a delay to ensure the data channel is fully open
      configUpdateTimeout = setTimeout(() => {
        try {
          console.log('Updating session config...');
          updateSessionConfig(sessionConfig);
        } catch (error) {
          console.error('Error updating session config:', error);
        }
      }, 1000); // Wait 1 second after connection before updating config
    }
    
    return () => {
      if (configUpdateTimeout) {
        clearTimeout(configUpdateTimeout);
      }
    };
  }, [isConnected, sessionConfig, updateSessionConfig]);
  
  // Handle connection and cleanup
  useEffect(() => {
    // Use the mountedRef from the component level
    if (autoConnect && mountedRef.current && !autoConnectRef.current) {
      console.log('ChatInterface: Auto-connecting session...');
      autoConnectRef.current = true;
      
      // Add a small delay to ensure proper initialization
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          console.log('ChatInterface: Auto-connect timer fired, starting session...');
          startSession().catch(err => {
            console.error('ChatInterface: Error in auto-connect startSession:', err);
          });
        }
      }, 2000); // Increased delay for better initialization
      
      return () => {
        clearTimeout(timer);
        console.log('ChatInterface: Cleaning up auto-connect timer');
      };
    }
  }, [autoConnect, startSession]);
  
  // Set mountedRef to false on unmount
  useEffect(() => {
    console.log('ChatInterface component mounted');
    
    return () => {
      console.log('ChatInterface component unmounting, setting mountedRef to false');
      mountedRef.current = false;
    };
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing, currentAssistantMessage]);
  
  // Add this useEffect for debugging
  useEffect(() => {
    if (isProcessing) {
      console.log('Current assistant message updated:', currentAssistantMessage);
    }
  }, [currentAssistantMessage, isProcessing]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && isConnected) {
      sendUserMessage(inputText.trim());
      setInputText('');
    }
  };
  
  // Manual start session handler
  const handleStartSession = () => {
    console.log('Manual start session button clicked, mountedRef:', mountedRef.current);
    try {
      console.log('ChatInterface: Calling startSession from button click');
      setLocalError(null); // Clear any previous local errors
      startSession().catch(err => {
        console.error('Error in manual startSession:', err);
      });
    } catch (error) {
      console.error('Error calling startSession:', error);
      setLocalError(`Error starting session: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Connection status */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isConnected
                ? 'bg-green-500'
                : isConnecting
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-red-500'
            }`}
          />
          <span className="text-sm font-medium">
            {isConnected
              ? 'Connected'
              : isConnecting
              ? 'Connecting...'
              : 'Disconnected'}
          </span>
          {isListening && (
            <span className="ml-4 text-sm font-medium flex items-center">
              <MicrophoneIcon className="w-4 h-4 mr-1 text-red-500 animate-pulse" />
              Listening...
            </span>
          )}
          {isSpeaking && (
            <span className="ml-4 text-sm font-medium">Speaking...</span>
          )}
        </div>
        <div className="flex space-x-2">
          {/* Debug button */}
          <button
            onClick={() => {
              console.log('Debug info:');
              console.log('- isConnected:', isConnected);
              console.log('- isConnecting:', isConnecting);
              console.log('- isProcessing:', isProcessing);
              console.log('- isSpeaking:', isSpeaking);
              console.log('- isListening:', isListening);
              console.log('- error:', error);
              console.log('- messages:', messages.length);
              console.log('- currentAssistantMessage:', currentAssistantMessage ? 'present' : 'none');
              
              // Test API connection
              fetch('/api/test')
                .then(res => res.json())
                .then(data => {
                  console.log('API test result:', data);
                  if (data.success) {
                    setLocalError(null);
                    alert('API connection successful! API key is working.');
                  } else {
                    setLocalError(`API connection error: ${data.error}`);
                    alert(`API connection error: ${data.error}`);
                  }
                })
                .catch(err => {
                  console.error('API test error:', err);
                  setLocalError(`API test error: ${err.message}`);
                  alert(`API test error: ${err.message}`);
                });
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Debug
          </button>
          
          {isConnected && (
            <button
              onClick={() => {
                console.log('Restarting session...');
                
                // End the current session
                endSession();
                
                // Start a new session after a short delay
                setTimeout(() => {
                  console.log('Starting new session after restart...');
                  startSession().catch(err => {
                    console.error('Error starting new session after restart:', err);
                  });
                }, 1000); // Increased delay to ensure proper cleanup
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Restart Session
            </button>
          )}
          {!isConnected && !isConnecting ? (
            <button
              onClick={handleStartSession}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Start Session
            </button>
          ) : (
            <button
              onClick={() => {
                console.log('Manual end session button clicked');
                try {
                  endSession();
                } catch (error) {
                  console.error('Error calling endSession:', error);
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              End Session
            </button>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 text-sm">
          {error}
        </div>
      )}
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {messages.length === 0 && !isProcessing ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-center">
              {isConnected
                ? "Start talking to the AI assistant"
                : "Connect to start a conversation"}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessageComponent
                key={message.id}
                message={message}
                isStreaming={false}
              />
            ))}
            {isProcessing && (
              <StreamingMessage 
                content={currentAssistantMessage || ''} 
              />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected || isProcessing}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isConnected || !inputText.trim() || isProcessing}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md disabled:opacity-50"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
          {isProcessing && (
            <button
              type="button"
              onClick={() => {
                // Implement stop generation functionality
              }}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
            >
              <StopIcon className="w-5 h-5" />
            </button>
          )}
        </form>
        
        {/* Audio element container */}
        <div className="hidden">
          {audioElement && <div id="audio-container" />}
        </div>
      </div>
    </div>
  );
}