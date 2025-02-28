import { v4 as uuidv4 } from 'uuid';
import { RealtimeSession, FunctionDefinition } from '../types/realtime';

/**
 * Creates a session with the OpenAI Realtime API
 */
export async function createRealtimeSession(
  model: string,
  voice?: string,
  instructions?: string
): Promise<{ ephemeralKey: string; sessionId: string }> {
  try {
    const response = await fetch('/api/realtime/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        voice,
        instructions,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create session');
    }

    const data = await response.json();
    return {
      ephemeralKey: data.client_secret.value,
      sessionId: data.id,
    };
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Initializes a WebRTC connection with the OpenAI Realtime API
 */
export async function initializeWebRTC(
  ephemeralKey: string,
  model: string,
  onTrack?: (e: RTCTrackEvent) => void,
  onDataChannel?: (dc: RTCDataChannel) => void
): Promise<{
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  localStream: MediaStream;
}> {
  try {
    // Create a peer connection
    const pc = new RTCPeerConnection();

    // Set up to handle remote audio from the model
    if (onTrack) {
      pc.ontrack = onTrack;
    }

    // Add local audio track for microphone input
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    ms.getTracks().forEach(track => pc.addTrack(track, ms));

    // Set up data channel for sending and receiving events
    const dc = pc.createDataChannel('oai-events');
    
    // Handle data channel events
    if (onDataChannel) {
      onDataChannel(dc);
    }

    // Start the session using the Session Description Protocol (SDP)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send the SDP offer to the server
    const sdpResponse = await fetch('/api/realtime/ws', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ephemeralKey,
        model,
        sdp: pc.localDescription?.sdp,
      }),
    });

    if (!sdpResponse.ok) {
      const errorText = await sdpResponse.text();
      throw new Error(`Failed to establish WebRTC connection: ${errorText}`);
    }

    const answerSdp = await sdpResponse.text();
    const answer = {
      type: 'answer',
      sdp: answerSdp,
    };
    
    await pc.setRemoteDescription(answer as RTCSessionDescriptionInit);

    return {
      peerConnection: pc,
      dataChannel: dc,
      localStream: ms,
    };
  } catch (error) {
    console.error('Error initializing WebRTC:', error);
    throw error;
  }
}

/**
 * Sends a message to the OpenAI Realtime API
 */
export function sendMessage(
  dataChannel: RTCDataChannel,
  message: string
): void {
  if (dataChannel.readyState !== 'open') {
    console.error('Data channel is not open');
    return;
  }

  const event = {
    type: 'conversation.item.create',
    event_id: uuidv4(),
    item: {
      type: 'message',
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: message,
        },
      ],
    },
  };

  dataChannel.send(JSON.stringify(event));
}

/**
 * Requests a response from the OpenAI Realtime API
 */
export function requestResponse(
  dataChannel: RTCDataChannel,
  modalities: ('text' | 'audio')[] = ['text', 'audio'],
  instructions?: string,
  tools?: FunctionDefinition[]
): void {
  if (dataChannel.readyState !== 'open') {
    console.error('Data channel is not open, cannot request response');
    return;
  }

  console.log('Requesting response from OpenAI Realtime API...');
  console.log('Modalities:', modalities);
  if (instructions) console.log('Instructions:', instructions);
  if (tools) console.log('Tools:', tools?.length || 0);

  const realtimeTools = tools?.map(tool => ({
    type: 'function' as const,
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }));

  const event = {
    type: 'response.create',
    event_id: uuidv4(),
    response: {
      modalities,
      ...(instructions && { instructions }),
      ...(realtimeTools && { tools: realtimeTools }),
    },
  };

  console.log('Sending response.create event:', JSON.stringify(event));
  
  try {
    dataChannel.send(JSON.stringify(event));
    console.log('Response request sent successfully');
  } catch (error) {
    console.error('Error sending response request:', error);
    throw new Error(`Failed to send response request: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Updates the session configuration
 */
export function updateSession(
  dataChannel: RTCDataChannel,
  sessionUpdate: Partial<RealtimeSession>
): void {
  if (dataChannel.readyState !== 'open') {
    console.error('Data channel is not open');
    return;
  }

  const event = {
    type: 'session.update',
    event_id: uuidv4(),
    session: sessionUpdate,
  };

  dataChannel.send(JSON.stringify(event));
}

/**
 * Sends a function call result to the OpenAI Realtime API
 */
export function sendFunctionResult(
  dataChannel: RTCDataChannel,
  callId: string,
  result: any
): void {
  if (dataChannel.readyState !== 'open') {
    console.error('Data channel is not open');
    return;
  }

  const event = {
    type: 'conversation.item.create',
    event_id: uuidv4(),
    item: {
      type: 'function_call_output',
      call_id: callId,
      output: JSON.stringify(result),
    },
  };

  dataChannel.send(JSON.stringify(event));
} 