import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  createRealtimeSession, 
  initializeWebRTC, 
  sendMessage, 
  requestResponse, 
  updateSession,
  sendFunctionResult
} from '../lib/api/realtime';
import { 
  RealtimeSession, 
  FunctionDefinition, 
  ChatMessage, 
  ResponseDoneEvent,
  ResponseTextDeltaEvent,
  ErrorEvent,
  TurnDetection
} from '../lib/types/realtime';

interface UseRealtimeApiOptions {
  model: string;
  voice?: string;
  initialInstructions?: string;
  functions?: FunctionDefinition[];
  autoConnect?: boolean;
}

interface UseRealtimeApiReturn {
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  messages: ChatMessage[];
  currentAssistantMessage: string;
  sendUserMessage: (message: string) => void;
  startSession: () => Promise<void>;
  endSession: () => void;
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  audioElement: HTMLAudioElement | null;
  updateSessionConfig: (config: Partial<RealtimeSession>) => void;
}

export function useRealtimeApi({
  model,
  voice = 'alloy',
  initialInstructions,
  functions = [],
  autoConnect = false,
}: UseRealtimeApiOptions): UseRealtimeApiReturn {
  // Track if component is mounted - initialize to true
  const isMountedRef = useRef(true);
  
  // Log mount status for debugging
  console.log('useRealtimeApi hook initialized, isMountedRef:', isMountedRef.current);
  
  // Session creation lock to prevent multiple simultaneous session creations
  const isCreatingSessionRef = useRef(false);
  // Timestamp of last session creation attempt to prevent rapid successive calls
  const lastSessionCreationAttemptRef = useRef(0);
  // Track connection attempts to implement exponential backoff
  const connectionAttemptsRef = useRef(0);
  
  // Connection state
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('');
  
  // Refs for WebRTC connection
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const ephemeralKeyRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const functionsMapRef = useRef<Map<string, FunctionDefinition>>(new Map());
  
  // Initialize functions map
  useEffect(() => {
    functionsMapRef.current = new Map();
    functions.forEach(func => {
      functionsMapRef.current.set(func.name, func);
    });
  }, [functions]);
  
  // Handle data channel messages
  const handleDataChannelMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      
      // Handle different event types
      switch (data.type) {
        case 'session.created':
          console.log('Session created:', data.session);
          break;
          
        case 'session.updated':
          console.log('Session updated:', data.session);
          break;
          
        case 'response.text.delta':
          handleTextDelta(data as ResponseTextDeltaEvent);
          break;
          
        case 'response.audio_transcript.delta':
          // Handle audio transcript delta events
          console.log('Audio transcript delta received:', data.delta);
          if (data.delta && typeof data.delta === 'string') {
            // Handle as text delta
            handleTextDelta({ delta: { text: data.delta } } as ResponseTextDeltaEvent);
          } else if (data.delta && typeof data.delta === 'object') {
            // Handle structured delta object
            const deltaText = data.delta.text || data.delta;
            handleTextDelta({ delta: { text: deltaText } } as ResponseTextDeltaEvent);
          }
          break;
          
        case 'response.done':
          handleResponseDone(data as ResponseDoneEvent);
          break;
          
        case 'input_audio_buffer.speech_started':
          setIsListening(true);
          break;
          
        case 'input_audio_buffer.speech_stopped':
          setIsListening(false);
          break;
          
        case 'error':
          handleError(data as ErrorEvent);
          break;
          
        default:
          // Other events can be handled as needed
          break;
      }
    } catch (error) {
      console.error('Error parsing data channel message:', error);
    }
  }, []);
  
  // Handle text delta events
  const handleTextDelta = useCallback((event: ResponseTextDeltaEvent) => {
    // First ensure isProcessing is set to true when receiving text deltas
    if (isMountedRef.current && !isProcessing) {
      console.log('Setting isProcessing to true on text delta');
      setIsProcessing(true);
    }
    
    // Log the received text delta
    console.log('Text delta received:', event.delta.text);
    
    if (!event.delta.text || event.delta.text.trim() === '') {
      console.log('Empty text delta received, skipping update');
      return;
    }
    
    if (isMountedRef.current) {
      console.log('Updating currentAssistantMessage with delta:', event.delta.text);
      
      setCurrentAssistantMessage(prev => {
        const updated = prev + event.delta.text;
        console.log('New currentAssistantMessage:', updated);
        return updated;
      });
    } else {
      console.log('Component not mounted, skipping text delta update');
    }
  }, [isProcessing]);
  
  // Handle response done events
  const handleResponseDone = useCallback((event: ResponseDoneEvent) => {
    console.log('Response done event received:', event);
    
    if (!isMountedRef.current) {
      console.log('Component not mounted, skipping response done handling');
      return;
    }
    
    console.log('Setting isProcessing to false');
    setIsProcessing(false);
    
    // Check if there's a function call in the response
    const functionCallOutput = event.response.output.find(output => output.type === 'function_call');
    
    if (functionCallOutput && functionCallOutput.name && functionCallOutput.call_id) {
      console.log('Function call detected in response:', functionCallOutput);
      // Handle function call
      const functionName = functionCallOutput.name;
      const callId = functionCallOutput.call_id;
      const argumentsJson = functionCallOutput.arguments || '{}';
      
      try {
        const args = JSON.parse(argumentsJson);
        const functionDef = functionsMapRef.current.get(functionName);
        
        if (functionDef) {
          // Add function call message
          const functionCallMessage: ChatMessage = {
            id: uuidv4(),
            role: 'function',
            content: argumentsJson,
            timestamp: Date.now(),
            functionCall: {
              name: functionName,
              arguments: argumentsJson,
            },
          };
          
          if (isMountedRef.current) {
            setMessages(prev => [...prev, functionCallMessage]);
          }
          
          // Execute function
          functionDef.handler(args)
            .then(result => {
              // Send function result back to the model
              if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && isMountedRef.current) {
                sendFunctionResult(dataChannelRef.current, callId, result);
                
                // Add function result message
                const functionResultMessage: ChatMessage = {
                  id: uuidv4(),
                  role: 'function',
                  content: JSON.stringify(result),
                  timestamp: Date.now(),
                  functionResult: {
                    name: functionName,
                    result: JSON.stringify(result),
                  },
                };
                
                if (isMountedRef.current) {
                  setMessages(prev => [...prev, functionResultMessage]);
                }
                
                // Request a new response
                requestResponse(dataChannelRef.current);
              }
            })
            .catch(error => {
              console.error('Error executing function:', error);
              if (isMountedRef.current) {
                setError(`Error executing function ${functionName}: ${error.message}`);
              }
            });
        } else {
          console.error(`Function ${functionName} not found`);
          if (isMountedRef.current) {
            setError(`Function ${functionName} not found`);
          }
        }
      } catch (error) {
        console.error('Error parsing function arguments:', error);
        if (isMountedRef.current) {
          setError(`Error parsing function arguments: ${error}`);
        }
      }
    } else if (currentAssistantMessage) {
      console.log('Adding assistant message to chat history:', currentAssistantMessage);
      // Add assistant message to chat history
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: currentAssistantMessage,
        timestamp: Date.now(),
      };
      
      if (isMountedRef.current) {
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentAssistantMessage('');
      }
    } else {
      console.log('No assistant message to add to chat history');
    }
  }, [currentAssistantMessage]);
  
  // Handle error events
  const handleError = useCallback((event: ErrorEvent) => {
    console.error('Error from Realtime API:', event);
    if (isMountedRef.current) {
      setError(`Error: ${event.message}`);
    }
  }, []);
  
  // Set isMounted to false on unmount
  useEffect(() => {
    // Log that the component is mounted
    console.log('useRealtimeApi hook mounted');
    isMountedRef.current = true;
    
    return () => {
      // Log that the component is unmounting
      console.log('useRealtimeApi hook unmounting, setting isMountedRef to false');
      isMountedRef.current = false;
      
      // Clean up any existing session
      console.log('Cleaning up session on unmount');
      
      // Stop local stream tracks
      if (localStreamRef.current) {
        console.log('Stopping local stream tracks on unmount...');
        localStreamRef.current.getTracks().forEach(track => {
          console.log('Stopping track on unmount:', track.kind);
          track.stop();
        });
        localStreamRef.current = null;
      }
      
      // Close data channel
      if (dataChannelRef.current) {
        console.log('Closing data channel on unmount...');
        dataChannelRef.current.close();
        dataChannelRef.current = null;
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        console.log('Closing peer connection on unmount...');
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, []);
  
  // Define endSession first to avoid circular dependency
  const endSession = useCallback(() => {
    console.log('Ending session...');
    
    // Reset connection attempts on manual end
    connectionAttemptsRef.current = 0;
    
    // Stop local stream tracks
    if (localStreamRef.current) {
      console.log('Stopping local stream tracks...');
      localStreamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      localStreamRef.current = null;
    }
    
    // Close data channel
    if (dataChannelRef.current) {
      console.log('Closing data channel...');
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      console.log('Closing peer connection...');
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Reset audio element
    if (audioElement) {
      console.log('Resetting audio element...');
      audioElement.srcObject = null;
      audioElement.pause();
      setAudioElement(null);
    }
    
    // Reset state - but don't call setMessages here to avoid circular updates
    if (isMountedRef.current) {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
      setIsListening(false);
      setIsProcessing(false);
      setCurrentAssistantMessage('');
    }
    
    ephemeralKeyRef.current = null;
    sessionIdRef.current = null;
  }, [audioElement]);
  
  // Start a new session
  const startSession = useCallback(async () => {
    console.log('Start session requested...', 'isMountedRef:', isMountedRef.current);
    
    // Check if component is still mounted before proceeding
    if (!isMountedRef.current) {
      console.log('Component not mounted, aborting startSession');
      return;
    }
    
    // Prevent multiple simultaneous session creations
    if (isCreatingSessionRef.current) {
      console.log('Session creation already in progress, ignoring duplicate request');
      return;
    }
    
    // Throttle session creation attempts (prevent more than one every 2 seconds)
    const now = Date.now();
    const timeSinceLastAttempt = now - lastSessionCreationAttemptRef.current;
    if (timeSinceLastAttempt < 2000) {
      console.log(`Throttling session creation. Last attempt was ${timeSinceLastAttempt}ms ago`);
      if (isMountedRef.current) {
        setError(`Please wait before trying to connect again (${Math.ceil((2000 - timeSinceLastAttempt) / 1000)} seconds)`);
      }
      return;
    }
    
    // Set lock and update timestamp
    isCreatingSessionRef.current = true;
    lastSessionCreationAttemptRef.current = now;
    
    console.log('Starting new session...');
    
    try {
      // Double-check mounted state
      if (!isMountedRef.current) {
        console.log('Component not mounted before session creation, aborting');
        isCreatingSessionRef.current = false;
        return;
      }
      
      setIsConnecting(true);
      setError(null);
      
      // Clean up any existing session
      console.log('Cleaning up existing session...');
      endSession();
      
      // Reset messages here instead of in endSession to avoid circular updates
      if (isMountedRef.current) {
        setMessages([]);
        setCurrentAssistantMessage('');
      }
      
      // Create a new audio element
      console.log('Creating new audio element...');
      const audio = new Audio();
      audio.autoplay = true;
      if (isMountedRef.current) {
        setAudioElement(audio);
      }
      
      // Create a new session
      console.log('Creating new session with OpenAI Realtime API...');
      console.log('Model:', model);
      console.log('Voice:', voice);
      
      let sessionResponse;
      try {
        sessionResponse = await createRealtimeSession(
          model,
          voice,
          initialInstructions
        );
        console.log('Session created successfully:', { sessionId: sessionResponse.sessionId });
        
        // Reset connection attempts on successful session creation
        connectionAttemptsRef.current = 0;
      } catch (sessionError) {
        console.error('Error creating session:', sessionError);
        
        // Increment connection attempts for exponential backoff
        connectionAttemptsRef.current++;
        
        // Calculate backoff time (2^n seconds, max 30 seconds)
        const backoffTime = Math.min(Math.pow(2, connectionAttemptsRef.current), 30) * 1000;
        
        if (isMountedRef.current) {
          setError(`Failed to create session: ${sessionError instanceof Error ? sessionError.message : String(sessionError)}. Will retry in ${Math.ceil(backoffTime/1000)} seconds.`);
          setIsConnecting(false);
        }
        
        // Schedule retry with exponential backoff
        setTimeout(() => {
          if (isMountedRef.current) {
            console.log(`Retrying session creation after backoff (attempt ${connectionAttemptsRef.current})`);
            startSession();
          }
        }, backoffTime);
        
        isCreatingSessionRef.current = false;
        return;
      }
      
      if (!isMountedRef.current) {
        console.log('Component not mounted after session creation, aborting');
        isCreatingSessionRef.current = false;
        return;
      }
      
      const { ephemeralKey, sessionId } = sessionResponse;
      ephemeralKeyRef.current = ephemeralKey;
      sessionIdRef.current = sessionId;
      
      // Initialize WebRTC connection
      console.log('Initializing WebRTC connection...');
      
      let webrtcResponse;
      try {
        webrtcResponse = await initializeWebRTC(
          ephemeralKey,
          model,
          (e) => {
            console.log('Received remote track:', e.track.kind);
            if (audio && isMountedRef.current) {
              audio.srcObject = e.streams[0];
              
              // Set up audio events
              audio.onplaying = () => {
                console.log('Audio started playing');
                if (isMountedRef.current) {
                  setIsSpeaking(true);
                }
              };
              audio.onpause = () => {
                console.log('Audio paused');
                if (isMountedRef.current) {
                  setIsSpeaking(false);
                }
              };
              audio.onended = () => {
                console.log('Audio ended');
                if (isMountedRef.current) {
                  setIsSpeaking(false);
                }
              };
            }
          },
          (dc) => {
            console.log('Data channel created');
            
            dc.onopen = () => {
              console.log('Data channel open');
              if (!isMountedRef.current) {
                console.log('Component not mounted when data channel opened, aborting');
                return;
              }
              
              setIsConnected(true);
              setIsConnecting(false);
              
              // Update session with functions if provided
              if (functions.length > 0) {
                console.log('Updating session with functions:', functions.length);
                
                const tools = functions.map(func => ({
                  type: 'function' as const,
                  name: func.name,
                  description: func.description,
                  parameters: func.parameters,
                }));
                
                try {
                  // Add a small delay to ensure the data channel is fully established
                  setTimeout(() => {
                    if (dc.readyState === 'open' && isMountedRef.current) {
                      try {
                        updateSession(dc, {
                          tools,
                          tool_choice: 'auto',
                        });
                        console.log('Session updated with functions successfully');
                      } catch (error) {
                        console.error('Error updating session with functions after delay:', error);
                      }
                    }
                  }, 1000);
                } catch (error) {
                  console.error('Error updating session with functions:', error);
                }
              }
            };
            
            dc.onclose = () => {
              console.log('Data channel closed');
              if (isMountedRef.current) {
                setIsConnected(false);
              }
            };
            
            dc.onerror = (error: Event) => {
              console.error('Data channel error:', error);
              if (isMountedRef.current) {
                setError(`Data channel error: ${error.type}`);
              }
            };
            
            dc.onmessage = handleDataChannelMessage;
          }
        );
        console.log('WebRTC connection initialized successfully');
      } catch (webrtcError) {
        console.error('Error initializing WebRTC:', webrtcError);
        
        // Increment connection attempts for exponential backoff
        connectionAttemptsRef.current++;
        
        // Calculate backoff time (2^n seconds, max 30 seconds)
        const backoffTime = Math.min(Math.pow(2, connectionAttemptsRef.current), 30) * 1000;
        
        if (isMountedRef.current) {
          setError(`Failed to initialize WebRTC: ${webrtcError instanceof Error ? webrtcError.message : String(webrtcError)}. Will retry in ${Math.ceil(backoffTime/1000)} seconds.`);
          setIsConnecting(false);
        }
        
        // Schedule retry with exponential backoff
        setTimeout(() => {
          if (isMountedRef.current) {
            console.log(`Retrying session creation after WebRTC failure (attempt ${connectionAttemptsRef.current})`);
            startSession();
          }
        }, backoffTime);
        
        isCreatingSessionRef.current = false;
        return;
      }
      
      if (!isMountedRef.current) {
        console.log('Component not mounted after WebRTC initialization, cleaning up resources');
        webrtcResponse.peerConnection.close();
        webrtcResponse.dataChannel.close();
        webrtcResponse.localStream.getTracks().forEach(track => track.stop());
        isCreatingSessionRef.current = false;
        return;
      }
      
      const { peerConnection, dataChannel, localStream } = webrtcResponse;
      peerConnectionRef.current = peerConnection;
      dataChannelRef.current = dataChannel;
      localStreamRef.current = localStream;
      
      // Set up additional event listeners for better debugging
      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state changed:', peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === 'failed' || peerConnection.iceConnectionState === 'disconnected') {
          if (isMountedRef.current) {
            setError(`WebRTC connection issue: ICE connection ${peerConnection.iceConnectionState}`);
            
            // If connection fails, try to reconnect after a delay
            if (peerConnection.iceConnectionState === 'failed') {
              setTimeout(() => {
                if (isMountedRef.current) {
                  console.log('Attempting to reconnect after ICE connection failure');
                  startSession();
                }
              }, 5000);
            }
          }
        }
      };
      
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state changed:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'failed' || peerConnection.connectionState === 'disconnected') {
          if (isMountedRef.current) {
            setError(`WebRTC connection issue: Connection ${peerConnection.connectionState}`);
            
            // If connection fails, try to reconnect after a delay
            if (peerConnection.connectionState === 'failed') {
              setTimeout(() => {
                if (isMountedRef.current) {
                  console.log('Attempting to reconnect after connection failure');
                  startSession();
                }
              }, 5000);
            }
          }
        }
      };
      
      console.log('Session started successfully');
      
    } catch (error: unknown) {
      console.error('Error starting session:', error);
      if (isMountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error details: ${errorMessage}`);
        setError(`Error starting session: ${errorMessage}`);
        setIsConnecting(false);
      }
    } finally {
      // Always release the lock
      isCreatingSessionRef.current = false;
    }
  }, [model, voice, initialInstructions, functions, handleDataChannelMessage, endSession]);
  
  // Send a user message
  const sendUserMessage = useCallback((message: string) => {
    if (!isConnected || !dataChannelRef.current) {
      setError('Not connected to Realtime API');
      return;
    }
    
    console.log('Sending user message:', message);
    
    // Reset the current assistant message
    if (isMountedRef.current) {
      console.log('Resetting currentAssistantMessage before sending new message');
      setCurrentAssistantMessage('');
    }
    
    // Add user message to chat history
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    
    if (isMountedRef.current) {
      setMessages(prev => [...prev, userMessage]);
    }
    
    // Send message to Realtime API
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      sendMessage(dataChannelRef.current, message);
      
      // Set processing state before requesting response
      if (isMountedRef.current) {
        console.log('Setting isProcessing to true before requesting response');
        setIsProcessing(true);
      }
      
      // Request a response
      requestResponse(dataChannelRef.current);
    } else {
      console.error('Data channel is not open, cannot send message');
      if (isMountedRef.current) {
        setError('Connection error: Data channel is not open');
      }
    }
  }, [isConnected]);
  
  // Update session configuration
  const updateSessionConfig = useCallback((config: Partial<RealtimeSession>) => {
    if (!isConnected || !dataChannelRef.current) {
      console.warn('Cannot update session config: Not connected to Realtime API');
      return;
    }
    
    try {
      // Validate turn_detection configuration if present
      if (config.turn_detection && !config.turn_detection.type) {
        console.warn('Missing required parameter: turn_detection.type. Adding default value "server_vad"');
        config.turn_detection.type = 'server_vad';
      }
      
      // Remove any unsupported properties from turn_detection
      if (config.turn_detection && 'mode' in config.turn_detection) {
        console.warn('Removing unsupported property: turn_detection.mode');
        const { mode, ...rest } = config.turn_detection as any;
        config.turn_detection = rest as TurnDetection;
      }
      
      console.log('Updating session with config:', JSON.stringify(config));
      
      // Check if data channel is open before updating
      if (dataChannelRef.current.readyState === 'open') {
        updateSession(dataChannelRef.current, config);
      } else {
        console.warn('Data channel is not open, delaying session config update');
        
        // Try again after a delay
        setTimeout(() => {
          if (dataChannelRef.current && dataChannelRef.current.readyState === 'open' && isMountedRef.current) {
            try {
              // Validate again in case the config was modified elsewhere
              if (config.turn_detection && !config.turn_detection.type) {
                config.turn_detection.type = 'server_vad';
              }
              
              // Remove any unsupported properties from turn_detection
              if (config.turn_detection && 'mode' in config.turn_detection) {
                const { mode, ...rest } = config.turn_detection as any;
                config.turn_detection = rest as TurnDetection;
              }
              
              updateSession(dataChannelRef.current, config);
              console.log('Session config updated after delay');
            } catch (retryError) {
              console.error('Error updating session config after delay:', retryError);
            }
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating session config:', error);
      if (isMountedRef.current) {
        setError(`Error updating session config: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }, [isConnected]);
  
  return {
    isConnecting,
    isConnected,
    error,
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
  };
} 