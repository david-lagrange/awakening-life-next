"use client";

import { useState, useEffect, useRef } from "react";
import ChatComponent, { Message } from "@/app/ui/guided-sessions/chat-component";
import SessionControls from "@/app/ui/guided-sessions/session-controls";
import { AudioCaptureService } from "@/app/lib/services/audio-capture";
import { TranscriptionService, TranscriptionStatus } from "@/app/lib/services/transcription";
import { agentProcessMessages } from "@/app/lib/actions/agent/agent-actions";

// This array will store the full conversation history for LLM calls
// It exists outside React state to avoid serialization issues
let conversationHistory: { role: 'user' | 'assistant' | 'system', content: string }[] = [];

export default function GuidedSession() {
  const [transcription, setTranscription] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
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
          
          // Add to React state for UI display
          setMessages(prev => [...prev, newMessage]);
          
          // Add to conversation history for LLM
          conversationHistory.push({
            role: 'user',
            content: fullTranscript.trim()
          });
          
          setTranscription(""); // Clear the transcription for the next speech segment
          
          // Get response
          simulateAssistantResponse();
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
    
    // Clean up conversation history on unmount
    return () => {
      stopSession();
      conversationHistory = [];
    };
  }, []);
  
  // Simulate assistant response (this would be replaced with actual API call)
  const simulateAssistantResponse = async () => {
    // First add a pending message to UI
    const pendingMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isComplete: false
    };
    
    setMessages(prev => [...prev, pendingMessage]);
    
    try {
      // Log conversation history to verify what's being sent
      console.log("Sending conversation history to LLM:", conversationHistory);
      
      // Call LLM with simplified conversation history objects
      const response = await agentProcessMessages(
        // Convert to simple objects that will serialize properly
        conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      );
      
      // Add assistant response to conversation history
      conversationHistory.push({
        role: 'assistant',
        content: response.textResponse
      });
      
      // Update the UI with LLM response
      setMessages(prev => prev.map(msg => 
        !msg.isComplete && msg.role === 'assistant' 
          ? {
              ...msg,
              content: response.textResponse,
              isComplete: true
            }
          : msg
      ));
      
      // Handle tool calls
      if (response.toolCalls && response.toolCalls.length > 0) {
        console.log("Tool calls from LLM:", response.toolCalls);
        // Future implementation: Execute tool calls
      }
    } catch (error) {
      console.error("Error getting LLM response:", error);
      
      // Update UI with error state
      setMessages(prev => prev.map(msg => 
        !msg.isComplete && msg.role === 'assistant' 
          ? {
              ...msg,
              content: "Sorry, I encountered an error processing your request.",
              isComplete: true
            }
          : msg
      ));
    }
  };
  
  // Handle text message from chat component
  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
      isComplete: true
    };
    
    // Add to React state for UI
    setMessages(prev => [...prev, newMessage]);
    
    // Add to conversation history for LLM
    conversationHistory.push({
      role: 'user',
      content: message
    });
    
    // Simulate response
    simulateAssistantResponse();
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
  
  // Toggle chat function
  const toggleChat = () => {
    if (chatComponentRef.current) {
      const newChatState = !isChatOpen;
      chatComponentRef.current.toggleChat();
      // Update our local state to match the chat component's state
      setIsChatOpen(newChatState);
    }
  };
  
  // Monitor speech detection state changes
  useEffect(() => {
    console.log("🔷 [GuidedSession] isSpeechDetected state changed:", isSpeechDetected);
  }, [isSpeechDetected]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Main content with controls */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <SessionControls
          status={status}
          error={error}
          startSession={startSession}
          stopSession={stopSession}
          toggleChat={toggleChat}
        />
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