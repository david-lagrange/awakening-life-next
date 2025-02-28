'use client';

/**
 * Service for interacting with OpenAI's Realtime API via WebRTC
 */
export class RealtimeApiService {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaStream: MediaStream | null = null;
  private eventListeners: Map<string, Set<(event: any) => void>> = new Map();
  private ephemeralKey: string | null = null;
  private connected: boolean = false;
  private model: string = 'gpt-4o-2024-05-13';
  private voice: string = 'alloy';
  private systemPrompt: string = '';

  /**
   * Initialize the Realtime API service
   * @param options Configuration options
   */
  async initialize(options: {
    model?: string;
    voice?: string;
    systemPrompt?: string;
  } = {}) {
    if (options.model) this.model = options.model;
    if (options.voice) this.voice = options.voice;
    if (options.systemPrompt) this.systemPrompt = options.systemPrompt;

    // Get ephemeral key from server
    await this.getEphemeralKey();
    
    // Create audio element for model's voice
    this.audioElement = document.createElement('audio');
    this.audioElement.autoplay = true;
    
    // Initialize WebRTC connection
    await this.setupWebRTC();
  }

  /**
   * Get an ephemeral key from the server
   */
  private async getEphemeralKey(): Promise<void> {
    try {
      const response = await fetch('/api/realtime/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          voice: this.voice,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get ephemeral key: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.ephemeralKey = data.client_secret.value;
    } catch (error) {
      console.error('Error getting ephemeral key:', error);
      throw error;
    }
  }

  /**
   * Set up WebRTC connection to OpenAI's Realtime API
   */
  private async setupWebRTC(): Promise<void> {
    if (!this.ephemeralKey) {
      throw new Error('Ephemeral key not available');
    }

    try {
      // Create peer connection
      this.peerConnection = new RTCPeerConnection();
      
      // IMPORTANT: We need to add an audio track BEFORE creating the offer
      // Get microphone access first
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        
        // Add audio track to peer connection
        if (this.mediaStream) {
          const audioTrack = this.mediaStream.getAudioTracks()[0];
          this.peerConnection.addTrack(audioTrack, this.mediaStream);
        }
      } catch (micError) {
        console.error('Microphone access error:', micError);
        throw new Error('Microphone access is required for the Realtime API. Please allow microphone access and try again.');
      }
      
      // Set up to play remote audio from the model
      if (this.audioElement && this.peerConnection) {
        this.peerConnection.ontrack = (e) => {
          if (this.audioElement) {
            this.audioElement.srcObject = e.streams[0];
          }
        };
      }
      
      // Create data channel for sending and receiving events
      this.dataChannel = this.peerConnection.createDataChannel('oai-events');
      this.dataChannel.addEventListener('message', this.handleServerEvent);
      this.dataChannel.addEventListener('open', () => {
        this.connected = true;
        this.emit('connection', { status: 'connected' });
        
        // Set system prompt if provided
        if (this.systemPrompt) {
          this.updateSession({ instructions: this.systemPrompt });
        }
      });
      
      // Create and set local description (offer)
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      // Verify that the offer includes an audio section
      if (!offer.sdp || !offer.sdp.includes('m=audio')) {
        throw new Error('Failed to create a valid SDP offer with audio. Please check microphone permissions.');
      }
      
      // Send offer to OpenAI's Realtime API
      const baseUrl = 'https://api.openai.com/v1/realtime';
      
      console.log('Sending request to:', `${baseUrl}?model=${this.model}`);
      console.log('Using ephemeral key:', this.ephemeralKey.substring(0, 5) + '...');
      
      const sdpResponse = await fetch(`${baseUrl}?model=${this.model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${this.ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });
      
      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        throw new Error(`Failed to connect to Realtime API: ${sdpResponse.status} ${sdpResponse.statusText} - ${errorText}`);
      }
      
      // Set remote description (answer)
      const answer = {
        type: 'answer',
        sdp: await sdpResponse.text(),
      };
      await this.peerConnection.setRemoteDescription(answer as RTCSessionDescriptionInit);
      
    } catch (error) {
      console.error('Error setting up WebRTC:', error);
      this.emit('error', { error });
      throw error;
    }
  }

  /**
   * Toggle microphone
   */
  toggleMicrophone(enable: boolean): void {
    if (!this.mediaStream) return;
    
    this.mediaStream.getAudioTracks().forEach(track => {
      track.enabled = enable;
    });
    
    this.emit('microphone', { status: enable ? 'active' : 'inactive' });
  }

  /**
   * Update session configuration
   */
  updateSession(sessionConfig: any): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.error('Data channel not open');
      return;
    }
    
    const event = {
      type: 'session.update',
      session: sessionConfig,
    };
    
    this.dataChannel.send(JSON.stringify(event));
  }

  /**
   * Create a text message in the conversation
   */
  sendTextMessage(text: string): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.error('Data channel not open');
      return;
    }
    
    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text,
          },
        ],
      },
    };
    
    this.dataChannel.send(JSON.stringify(event));
  }

  /**
   * Request a response from the model
   */
  createResponse(options: {
    modalities?: string[];
    instructions?: string;
    tools?: any[];
  } = {}): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.error('Data channel not open');
      return;
    }
    
    const event = {
      type: 'response.create',
      response: {
        ...options,
      },
    };
    
    this.dataChannel.send(JSON.stringify(event));
  }

  /**
   * Handle events from the server
   */
  private handleServerEvent = (e: MessageEvent): void => {
    try {
      const event = JSON.parse(e.data);
      this.emit(event.type, event);
    } catch (error) {
      console.error('Error handling server event:', error);
    }
  };

  /**
   * Register an event listener
   */
  on(eventType: string, callback: (event: any) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)?.add(callback);
  }

  /**
   * Remove an event listener
   */
  off(eventType: string, callback: (event: any) => void): void {
    this.eventListeners.get(eventType)?.delete(callback);
  }

  /**
   * Emit an event to all registered listeners
   */
  private emit(eventType: string, event: any): void {
    console.log(`Emitting event: ${eventType}`, event);
    
    // First, emit to specific event listeners
    this.eventListeners.get(eventType)?.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in ${eventType} event listener:`, error);
      }
    });
    
    // Then, emit to wildcard listeners
    this.eventListeners.get('*')?.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in wildcard event listener:`, error);
      }
    });
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    // Stop microphone
    this.toggleMicrophone(false);
    
    // Close data channel
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Clear event listeners
    this.eventListeners.clear();
    
    // Reset state
    this.connected = false;
    this.ephemeralKey = null;
  }

  /**
   * Check if connected to the Realtime API
   */
  isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton instance
export const realtimeApiService = new RealtimeApiService(); 