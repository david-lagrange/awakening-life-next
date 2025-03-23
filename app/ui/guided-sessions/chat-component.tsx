"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { 
  XMarkIcon, 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isComplete?: boolean;
}

interface ChatComponentProps {
  transcription: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  isSpeechDetected?: boolean;
}

const ChatComponent = forwardRef<{ toggleChat: () => void }, ChatComponentProps>(({ 
  transcription, 
  messages = [],
  onSendMessage,
  isSpeechDetected = false
}, ref) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(384); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true); // Start showing empty state
  const [hasDetectedSpeech, setHasDetectedSpeech] = useState(false); // Track if we've ever detected speech
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const emptyStateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard mobile breakpoint
      
      // If mobile, set chat width to full screen
      if (window.innerWidth < 768) {
        setChatWidth(window.innerWidth);
      } else if (chatWidth > window.innerWidth * 0.8) {
        // Ensure chat width isn't too large when resizing window
        setChatWidth(Math.min(600, window.innerWidth * 0.8));
      }
    };
    
    // Check initially
    checkIsMobile();
    
    // Update on resize
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [chatWidth]);
  
  // Expose toggleChat method to parent component
  useImperativeHandle(ref, () => ({
    toggleChat: () => {
      setIsChatOpen(!isChatOpen);
    }
  }));
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transcription]);
  
  // Handle resize drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || isMobile) return;
      
      // Calculate new width based on mouse position
      // We're dragging from right to left, so we subtract from window width
      const newWidth = window.innerWidth - e.clientX;
      
      // Set min and max constraints
      const minWidth = 300; // Minimum width in pixels
      const maxWidth = Math.min(600, window.innerWidth * 0.8); // Maximum width in pixels, not more than 80% of window
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setChatWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
    
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection while resizing
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isMobile]);
  
  const startResize = (e: React.MouseEvent) => {
    if (isMobile) return; // Don't allow resizing on mobile
    e.preventDefault();
    setIsResizing(true);
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };
  
  const sendTextMessage = () => {
    if (!textInput.trim() || isProcessing) return;
    
    if (onSendMessage) {
      setIsProcessing(true);
      onSendMessage(textInput.trim());
      
      // Reset after sending
      setTextInput('');
      
      // Simulate end of processing
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    }
  };
  
  // Handle speech detection with modified approach
  useEffect(() => {
    console.log("🔷 [ChatComponent] isSpeechDetected prop changed:", isSpeechDetected);
    
    // If speech is detected, mark that we've detected speech and hide empty state
    if (isSpeechDetected) {
      setHasDetectedSpeech(true); // Remember that we've detected speech
      setShowEmptyState(false);
    }
  }, [isSpeechDetected]);
  
  // Update empty state based on messages, but respect hasDetectedSpeech flag
  useEffect(() => {
    // Only show empty state if there are no messages AND we've never detected speech
    // Once speech is detected, we never show empty state until at least one message appears
    if (messages.length > 0) {
      // If we have messages, reset hasDetectedSpeech and only use showEmptyState
      setHasDetectedSpeech(false);
      setShowEmptyState(false);
    } else if (!hasDetectedSpeech && !isSpeechDetected && !transcription) {
      // Only show empty state if we've never detected speech and nothing is happening
      setShowEmptyState(true);
    }
  }, [messages.length, hasDetectedSpeech, isSpeechDetected, transcription]);
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Removed the floating chat toggle button since we're using the one from guided-session */}
      
      {/* Chat sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-800 shadow-lg border-l border-gray-300 dark:border-gray-700 
          transform transition-transform duration-300 ease-in-out z-50 flex flex-col
          ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}
          ${isMobile ? 'left-0' : ''}`}
        style={{ width: isMobile ? '100%' : `${chatWidth}px` }}
      >
        {/* Resize handle - hidden on mobile */}
        {!isMobile && (
          <div 
            ref={resizeHandleRef}
            className="absolute top-0 left-0 w-1 h-full cursor-ew-resize group"
            onMouseDown={startResize}
            aria-hidden="true"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-blue-400 group-active:bg-blue-500 transition-colors"></div>
          </div>
        )}
        
        {/* Chat header */}
        <div className="p-4 border-b border-t border-gray-300 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-2.5" aria-hidden="true">
              <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Conversation</h2>
          </div>
          <button 
            onClick={toggleChat}
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label="Close chat"
            title="Close chat"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        
        {/* Chat messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
          {/* Show current transcription or Listening indicator */}
          {((transcription && transcription.trim().length > 0) || isSpeechDetected) && (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-lg px-4 py-3 shadow-sm bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
                {transcription && transcription.trim().length > 0 && (
                  <div className="whitespace-pre-wrap text-sm">{transcription}</div>
                )}
                {isSpeechDetected && (
                  <div className={`flex justify-end ${transcription ? 'mt-1.5' : ''}`}>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Listening...</span>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-150"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Show past messages with timestamps */}
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-lg px-4 py-3 shadow-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800' 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                {message.isComplete === false && (
                  <div className="mt-1.5 flex justify-end">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {/* Only show "No messages yet" when showEmptyState is true and never detected speech */}
          {showEmptyState && !hasDetectedSpeech && messages.length === 0 && !transcription && !isSpeechDetected && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8" aria-hidden="true" />
              </div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="mt-2 text-sm">Your conversation will appear here.</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input - make it more mobile friendly */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-stretch space-x-2">
            <div className="flex-grow relative">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={isMobile ? 2 : 1}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                  px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent
                  resize-none text-sm"
                style={{ height: isMobile ? 'auto' : '2.5rem' }}
                disabled={isProcessing}
              />
            </div>
            
            <button
              onClick={sendTextMessage}
              disabled={!textInput.trim() || isProcessing}
              className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-600 text-white 
                hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors"
              aria-label="Send message"
              title="Send message"
            >
              {isProcessing ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging purposes
ChatComponent.displayName = "ChatComponent";

export default ChatComponent; 