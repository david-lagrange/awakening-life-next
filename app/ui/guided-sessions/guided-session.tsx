"use client";

import { useState, useEffect, useRef } from "react";
import ChatComponent, { Message } from "@/app/ui/guided-sessions/chat-component";
import { AudioCaptureService } from "@/app/lib/services/audio-capture";
import { TranscriptionService, TranscriptionStatus } from "@/app/lib/services/transcription";
import { 
  MicrophoneIcon, 
  SpeakerWaveIcon, 
  StopIcon, 
  ArrowPathIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

export default function GuidedSession() {
  const [transcription, setTranscription] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [allUserMessages, setAllUserMessages] = useState<Message[]>([]); // Store all user messages for LLM call
  const [status, setStatus] = useState<TranscriptionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [audioCapture, setAudioCapture] = useState<AudioCaptureService | null>(null);
  const [transcriptionService, setTranscriptionService] = useState<TranscriptionService | null>(null);
  const [isSpeechDetected, setIsSpeechDetected] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatComponentRef = useRef<{ toggleChat: () => void } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Initialize services
  useEffect(() => {
    // Create the transcription service
    const newTranscriptionService = new TranscriptionService({
      onTranscriptionUpdate: (text) => {
        setTranscription((prev) => prev + text);
      },
      onTranscriptionCompleted: (fullTranscript) => {
        // Add completed transcription as a new message with timestamp
        setIsSpeechDetected(false); // Reset speech detection when transcription is complete
        if (fullTranscript && fullTranscript.trim()) {
          const newMessage = { 
            role: 'user' as const, 
            content: fullTranscript.trim(),
            timestamp: new Date(),
            isComplete: true
          };
          
          setMessages(prev => [...prev, newMessage]);
          setAllUserMessages(prev => [...prev, newMessage]); // Store for LLM call
          setTranscription(""); // Clear the transcription for the next speech segment
          
          // You would normally send this to an API to get a response
          // For now, we'll simulate a response after a delay
          simulateAssistantResponse(newMessage.content);
        }
      },
      onError: (message) => {
        setError(message);
        stopSession();
      },
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        // When transcription service is active, start audio capture
        if (newStatus === 'active' && !audioCapture) {
          startAudioCapture(newTranscriptionService);
        }
      },
      // Add new handlers for speech events
      onSpeechStarted: () => {
        console.log("🔷 [GuidedSession] Speech started - updating state");
        setIsSpeechDetected(true);
      },
      onSpeechStopped: () => {
        console.log("🔷 [GuidedSession] Speech stopped - updating state");
        setIsSpeechDetected(false);
      }
    });
    
    setTranscriptionService(newTranscriptionService);
    
    // Cleanup on unmount
    return () => {
      stopSession();
    };
  }, []);
  
  // Simulate assistant response (this would be replaced with actual API call)
  const simulateAssistantResponse = (userMessage: string) => {
    // First add a pending message
    const responseId = `msg_${Date.now()}`;
    const pendingMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isComplete: false
    };
    
    setMessages(prev => [...prev, pendingMessage]);
    
    // Simulate typing delay and response
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        !msg.isComplete && msg.role === 'assistant' 
          ? {
              ...msg,
              content: `I received your message: "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"`,
              isComplete: true
            }
          : msg
      ));
    }, 1500);
  };
  
  // Handle text message from chat component
  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
      isComplete: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setAllUserMessages(prev => [...prev, newMessage]);
    
    // Simulate response for text messages too
    simulateAssistantResponse(message);
  };
  
  // Start capturing audio and sending to transcription service
  const startAudioCapture = (transService: TranscriptionService) => {
    const newAudioCapture = new AudioCaptureService({
      onAudioData: (audioData) => {
        transService.sendAudio(audioData);
      }
    });
    
    newAudioCapture.start()
      .then(() => {
        setAudioCapture(newAudioCapture);
      })
      .catch((err) => {
        setError(err.message || "Failed to start audio capture");
        stopSession();
      });
  };
  
  // Start the guided session
  const startSession = async () => {
    console.log("🔷 [GuidedSession] Starting guided session");
    setTranscription("");
    // Don't clear messages when starting a new session
    setError(null);
    
    if (transcriptionService) {
      await transcriptionService.start();
    }
  };
  
  // Stop the guided session
  const stopSession = () => {
    console.log("🔷 [GuidedSession] Stopping guided session");
    
    if (audioCapture) {
      audioCapture.stop();
      setAudioCapture(null);
    }
    
    if (transcriptionService) {
      transcriptionService.stop();
    }
  };
  
  // Scroll to bottom of messages
  useEffect(() => {
    // Only scroll if messages changed AND chat is open
    if (isChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, transcription, isChatOpen]);
  
  // Handle body scroll locking when chat is open on mobile
  useEffect(() => {
    // Only apply scroll locking on mobile
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      const body = document.body;
      
      if (isChatOpen) {
        // Save the current scroll position
        const scrollY = window.scrollY;
        
        // Add styles to prevent scrolling but maintain position
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        html.style.scrollBehavior = 'auto';
        
        return () => {
          // Cleanup function to restore scrolling
          body.style.position = '';
          body.style.top = '';
          body.style.width = '';
          html.style.scrollBehavior = '';
          
          // Restore scroll position
          window.scrollTo(0, scrollY);
        };
      }
    }
  }, [isChatOpen]);
  
  // New function to toggle chat from parent component
  const toggleChat = () => {
    if (chatComponentRef.current) {
      const newChatState = !isChatOpen;
      chatComponentRef.current.toggleChat();
      // Update our local state to match the chat component's state
      setIsChatOpen(newChatState);
    }
  };
  
  const isLoading = status === 'connecting';
  const isSessionActive = status === 'active';
  const circleColor = "#3B82F6"; // Blue color matching the old style
  
  // Optional: Add a function to get all user messages for LLM call
  const getUserMessagesForLLM = () => {
    return allUserMessages.map(msg => msg.content);
  };

  // Monitor speech detection state changes
  useEffect(() => {
    console.log("🔷 [GuidedSession] isSpeechDetected state changed:", isSpeechDetected);
  }, [isSpeechDetected]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Main content with glowing circle */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Guided Session</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Record your thoughts and receive guidance</p>
        </div>
        
        {/* Status Circle - Elegant design from old component */}
        <div className="mb-8">
          {isSessionActive ? (
            <div 
              className="w-32 h-32 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: circleColor,
                boxShadow: `0 0 30px ${circleColor}`
              }}
            >
              <MicrophoneIcon className="h-12 w-12 text-white animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 
                  border border-blue-200/50 dark:border-blue-800/30 shadow-sm flex items-center justify-center
                  transition-all duration-300 hover:shadow-md group-hover:border-blue-300 dark:group-hover:border-blue-700">
                  {isLoading ? (
                    <ArrowPathIcon className="h-10 w-10 text-blue-500 dark:text-blue-400 animate-spin" />
                  ) : (
                    <MicrophoneIcon className="h-12 w-12 text-blue-500 dark:text-blue-400 transition-transform 
                      duration-300 group-hover:scale-110" aria-hidden="true" />
                  )}
                </div>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium text-sm tracking-wide">
                {isLoading ? "Connecting..." : "Start Session"}
              </span>
            </div>
          )}
        </div>
        
        {/* Move buttons closer to the circle by placing them here */}
        <div className="mb-16 flex justify-center">
          <div className="flex space-x-6">
            {/* Start Session button */}
            <div className="flex flex-col items-center">
              <button
                onClick={startSession}
                disabled={isSessionActive || isLoading}
                className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
                  border border-blue-300 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200 dark:hover:bg-blue-800/40 
                  transition-colors"
                aria-label="Start session"
              >
                {isLoading ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <MicrophoneIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {isLoading ? "Connecting..." : "Start"}
              </span>
            </div>
            
            {/* End Session button */}
            <div className="flex flex-col items-center">
              <button
                onClick={stopSession}
                disabled={!isSessionActive || isLoading}
                className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 
                  border border-red-300 dark:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/40
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-200 dark:hover:bg-red-800/40
                  transition-colors"
                aria-label="End session"
              >
                <StopIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">End</span>
            </div>
            
            {/* Chat button */}
            <div className="flex flex-col items-center">
              <button
                onClick={toggleChat}
                className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
                  border border-blue-300 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40
                  hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                aria-label="Toggle chat"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">Chat</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-8 max-w-md bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md p-4">
            <div className="flex items-start">
              <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Component with onSendMessage handler */}
      <ChatComponent 
        ref={chatComponentRef}
        transcription={transcription} 
        messages={messages}
        onSendMessage={handleSendMessage}
        isSpeechDetected={isSpeechDetected}
      />
    </div>
  );
} 