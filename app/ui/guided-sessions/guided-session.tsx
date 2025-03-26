"use client";

import { useState, useEffect, useRef } from "react";
import ChatComponent, { Message } from "@/app/ui/guided-sessions/chat-component";
import SessionControls from "@/app/ui/guided-sessions/session-controls";
import { AudioCaptureService } from "@/app/lib/services/audio-capture";
import { TranscriptionService, TranscriptionStatus } from "@/app/lib/services/transcription";
import { agentProcessMessages } from "@/app/lib/actions/agent/agent-actions";
import { useLogger } from "@/app/lib/hooks/useLogger";
import { createNewSession, markSessionComplete } from "@/app/lib/actions/session/session-actions";
import { createNewSessionMessage } from "@/app/lib/actions/session/session-message-actions";

// This array will store the full conversation history for LLM calls
// It exists outside React state to avoid serialization issues
let conversationHistory: { role: 'user' | 'assistant' | 'system', content: string }[] = [];

interface GuidedSessionProps {
  sessionTypeId: string;
  model?: string;
  voice?: string;
  color?: string;
}

export default function GuidedSession({ 
  sessionTypeId, 
  model = "gpt-4o", 
  voice = "nova", 
  color = "#3B82F6" 
}: GuidedSessionProps) {
  const logger = useLogger('[CLIENT] GuidedSession');
  
  const [transcription, setTranscription] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<TranscriptionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [audioCapture, setAudioCapture] = useState<AudioCaptureService | null>(null);
  const [transcriptionService, setTranscriptionService] = useState<TranscriptionService | null>(null);
  const [isSpeechDetected, setIsSpeechDetected] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // Add a ref to track the current playing audio element
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const chatComponentRef = useRef<{ toggleChat: () => void } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Add a ref to track the latest sessionId
  const sessionIdRef = useRef<string | null>(null);
  
  // Update the ref whenever sessionId changes
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);
  
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
          // Get the current sessionId from the ref instead of state
          const currentSessionId = sessionIdRef.current;
          
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
          
          // Use the captured sessionId in a log to debug
          logger.info('Current sessionId when processing transcript', { 
            sessionId: currentSessionId 
          });
          
          // Save speech transcription to backend - pass the current sessionId directly
          if (currentSessionId) {
            saveMessageToBackend(fullTranscript.trim(), 'user', currentSessionId);
          } else {
            logger.warn('No sessionId available to save transcription message');
          }
          
          setTranscription(""); // Clear the transcription for the next speech segment
          
          // Get response
          getAssistantResponse();
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
        logger.info('Speech started - updating state');
        setIsSpeechDetected(true);
        
        // Stop any playing audio when user starts speaking
        if (currentAudioRef.current) {
          logger.info('Stopping audio playback because user started speaking');
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        }
      },
      onSpeechStopped: () => {
        logger.info('Speech stopped - updating state');
        setIsSpeechDetected(false);
      }
    });
    
    setTranscriptionService(newTranscriptionService);
    
    // Clean up conversation history and session on unmount
    return () => {
      stopSession();
      conversationHistory = [];
      
      // Complete the session when component unmounts
      if (sessionIdRef.current) {
        completeSession();
      }
      
      // Also stop any playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Add effect to handle page navigation/tab closing
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionId) {
        // Try to complete the session when the page is about to unload
        completeSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);
  
  // Helper function to complete a session
  const completeSession = async () => {
    if (sessionId) {
      logger.info('Completing session due to navigation/unmount', { sessionId });
      try {
        await markSessionComplete(sessionId);
        setSessionId(null);
      } catch (error) {
        logger.error('Failed to complete session', { 
          sessionId,
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }
  };
  
  // Update the saveMessageToBackend function to accept an explicit sessionId parameter
  const saveMessageToBackend = async (messageContent: string, role: 'user' | 'assistant', explicitSessionId?: string) => {
    // Use the explicit sessionId if provided, otherwise fall back to the ref value
    const effectiveSessionId = explicitSessionId || sessionIdRef.current;
    
    logger.info('SessionId from saveMessageToBackend', { sessionId: effectiveSessionId });

    if (!effectiveSessionId) {
      logger.warn('Attempted to save message but no sessionId exists');
      return;
    }
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('message', messageContent);
      formData.append('role', role);
      formData.append('weight', '3'); // Fixed weight as specified
      
      // Fire and forget - don't await the result
      createNewSessionMessage(
        effectiveSessionId,
        { success: false },
        formData
      ).catch(error => {
        logger.error('Error saving message to backend', {
          sessionId: effectiveSessionId,
          error: error instanceof Error ? error.message : String(error)
        });
      });
    } catch (error) {
      logger.error('Error preparing to save message', {
        sessionId: effectiveSessionId,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
  
  // Get assistant response
  const getAssistantResponse = async () => {
    // Capture current sessionId from ref instead of state
    const currentSessionId = sessionIdRef.current;
    
    // Log the current sessionId to help with debugging
    logger.info('Current sessionId when generating response', { 
      sessionId: currentSessionId 
    });

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
      logger.debug("Sending conversation history to LLM", { 
        historyLength: conversationHistory.length 
      });
      
      // Call LLM with simplified conversation history objects and pass the model
      const response = await agentProcessMessages(
        // Convert to simple objects that will serialize properly
        conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        model // Pass the model prop
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
      
      // Save assistant message to backend
      if (currentSessionId) {
        saveMessageToBackend(response.textResponse, 'assistant', currentSessionId);
      } else {
        logger.warn('No sessionId available to save assistant message');
      }
      
      // Handle tool calls
      if (response.toolCalls && response.toolCalls.length > 0) {
        logger.info("Tool calls received from LLM", { 
          toolCallCount: response.toolCalls.length 
        });
        // Future implementation: Execute tool calls
      }
      
      // NEW CODE: Convert the text response to speech and play it
      try {
        const { convertResponseToSpeech } = await import('@/app/lib/actions/agent/agent-response-actions');
        const { audioBase64 } = await convertResponseToSpeech(
          response.textResponse,
          conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          voice // Pass the voice prop
        );
        
        // Play the audio from Base64 string
        playResponseAudio(audioBase64);
      } catch (error) {
        console.error("Error converting response to speech:", error);
      }
    } catch (error) {
      logger.error("Error getting LLM response", { 
        error: error instanceof Error ? error.message : String(error)
      });
      
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
  
  // Function to play audio response from Base64 string
  const playResponseAudio = (audioBase64: string) => {
    try {
      // If there's already audio playing, stop it first
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      
      // Create an audio element
      const audio = new Audio();
      
      // Set the audio source to a data URL with the Base64 encoded audio
      audio.src = `data:audio/mp3;base64,${audioBase64}`;
      
      // Enable inline playback for iOS (prevents fullscreen playback requirement)
      audio.setAttribute('playsinline', 'true');
      
      // Enable webkit-playsinline for older iOS versions
      audio.setAttribute('webkit-playsinline', 'true');
      
      // Set as low latency as possible
      audio.preload = 'auto';
      
      // Store the reference to the current audio element
      currentAudioRef.current = audio;
      
      audio.addEventListener('ended', () => {
        logger.info("Audio playback completed");
        // Clear the reference when playback ends naturally
        currentAudioRef.current = null;
      });
      
      audio.addEventListener('error', (e) => {
        logger.error("Error playing audio", { 
          error: e instanceof Error ? e.message : String(e),
          code: audio.error ? audio.error.code : 'unknown'
        });
        // Clear the reference on error
        currentAudioRef.current = null;
      });
      
      // For mobile devices, try to unlock audio context if needed
      if (typeof AudioContext !== 'undefined' || typeof (window as Window & typeof globalThis & { webkitAudioContext?: AudioContext }).webkitAudioContext !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: AudioContext }).webkitAudioContext;
        const audioContext = new AudioContextClass();
        
        // Resume audio context if it's suspended (common on mobile)
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            logger.info("AudioContext resumed successfully");
          }).catch(err => {
            logger.warn("Failed to resume AudioContext", { error: String(err) });
          });
        }
      }
      
      // Play the audio with a user activation flag to help with mobile playback
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            logger.info("Audio playback started successfully");
          })
          .catch(error => {
            logger.error("Failed to play audio", {
              error: error instanceof Error ? error.message : String(error),
              name: error instanceof Error ? error.name : 'Unknown'
            });
            
            // If autoplay was prevented (common on mobile), add a visible play button
            if (error.name === 'NotAllowedError') {
              logger.warn("Autoplay prevented - likely requires user interaction");
              
              // Try again on next user interaction
              const resumeAudio = () => {
                audio.play().catch(err => {
                  logger.error("Still failed to play audio after interaction", { 
                    error: String(err) 
                  });
                });
                // Clean up event listeners after one attempt
                document.body.removeEventListener('touchstart', resumeAudio);
                document.body.removeEventListener('click', resumeAudio);
              };
              
              // Add temporary event listeners to try playing on next user interaction
              document.body.addEventListener('touchstart', resumeAudio, { once: true });
              document.body.addEventListener('click', resumeAudio, { once: true });
            }
            
            currentAudioRef.current = null;
          });
      }
    } catch (error) {
      logger.error("Error playing audio from Base64", { 
        error: error instanceof Error ? error.message : String(error)
      });
      currentAudioRef.current = null;
    }
  };
  
  // Update handleSendMessage to save the message
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
    
    // Save message to backend
    if (sessionIdRef.current) {
      saveMessageToBackend(message, 'user', sessionIdRef.current);
    } else {
      logger.warn('No sessionId available to save user message');
    }
    
    // Simulate response
    getAssistantResponse();
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
    logger.info("Starting guided session", { sessionTypeId });
    setTranscription("");
    setError(null);
    
    // Set UI state to connecting immediately
    setStatus('connecting');
    
    try {
      // Create a new session in the backend
      const result = await createNewSession(
        { success: false },
        (() => {
          const formData = new FormData();
          formData.append('sessionTypeId', sessionTypeId);
          return formData;
        })()
      );
      
      // Check if session creation was successful
      const sessionResponse = result as unknown as { sessionId?: string };
      if (result.success && sessionResponse.sessionId) {
        // Store sessionId in a local variable first
        const newSessionId = sessionResponse.sessionId;
        
        // Set the session ID in state
        setSessionId(newSessionId);
        
        logger.info('Session created successfully', { 
          sessionId: newSessionId,
          type: sessionTypeId 
        });
        
        // Only start transcription service after ensuring sessionId is set
        if (transcriptionService) {
          // Pass true to force start even if status is already 'connecting'
          transcriptionService.start(true).then(() => {
            logger.info('Transcription service started with active sessionId', {
              sessionId: newSessionId
            });
          });
        }
      } else {
        logger.error('Failed to create session or no ID returned', { 
          error: result.message || 'Unknown error' 
        });
        // Reset to idle state if session creation failed
        setStatus('idle');
      }
    } catch (error) {
      logger.error('Error creating session', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      // Reset to idle state if there was an error
      setStatus('idle');
    }
  };
  
  // Stop the guided session
  const stopSession = () => {
    logger.info("Stopping guided session");
    
    if (audioCapture) {
      audioCapture.stop();
      setAudioCapture(null);
    }
    
    if (transcriptionService) {
      transcriptionService.stop();
    }
    
    // Complete the session when it's stopped manually
    if (sessionIdRef.current) {
      completeSession();
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
    logger.debug("isSpeechDetected state changed", { isSpeechDetected });
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
          color={color}
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