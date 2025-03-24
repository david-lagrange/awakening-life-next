"use server";

import OpenAI from "openai";
import { createLogger } from '@/app/lib/logger';

// Create component-specific logger
const agentResponseLogger = createLogger('[SERVER] AgentResponseActions');

// Define message types for consistency with agent-actions.ts
interface SimpleMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Available voices from OpenAI
type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'coral' | 'sage' | 'ash';

/**
 * Converts assistant text response to speech using OpenAI's TTS API
 * Returns the audio as a Base64 string for direct playing instead of saving to disk
 */
export async function convertResponseToSpeech(
  textResponse: string,
  conversationHistory: SimpleMessage[],
  voicePreference?: OpenAIVoice
): Promise<{ audioBase64: string }> {
  agentResponseLogger.info('Converting text response to speech', {
    responseLength: textResponse.length,
    responsePreview: textResponse.substring(0, 30) + '...',
    historyLength: conversationHistory.length,
    voicePreference
  });

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    agentResponseLogger.debug('Text to speech conversion details', {
      textResponsePreview: textResponse.substring(0, 50) + '...',
      conversationHistoryCount: conversationHistory.length,
      latestHistoryItem: conversationHistory.length > 0 ? 
        `${conversationHistory[conversationHistory.length-1].role}: ${conversationHistory[conversationHistory.length-1].content.substring(0, 30)}...` : 'None',
      voicePreference
    });

    // Voice settings
    const voiceSettings = {
      voice: "nova",
      instructions: `Voice Affect: Soft, gentle, soothing; embody tranquility.

        Tone: Calm, reassuring, peaceful; convey genuine warmth and serenity.

        Pacing: Slow, deliberate, and unhurried; pause gently after instructions to allow the listener time to relax and follow along.

        Emotion: Deeply soothing and comforting; express genuine kindness and care.

        Pronunciation: Smooth, soft articulation, slightly elongating vowels to create a sense of ease.

        Pauses: Use thoughtful pauses, especially between breathing instructions and visualization guidance, enhancing relaxation and mindfulness.`
    };

    agentResponseLogger.info('Using voice settings', {
      voice: voiceSettings.voice,
      instructionsPreview: voiceSettings.instructions.substring(0, 50) + '...'
    });

    // Step 2: Generate speech using OpenAI's TTS API
    agentResponseLogger.info('Calling OpenAI TTS API', {
      model: "gpt-4o-mini-tts",
      voice: voiceSettings.voice
    });

    const speechResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voiceSettings.voice as OpenAIVoice,
      input: textResponse,
      instructions: voiceSettings.instructions,
    });

    // Step 3: Convert to buffer and then to Base64 for direct playback
    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    const audioBase64 = buffer.toString('base64');
    
    agentResponseLogger.info('Successfully converted text to speech', {
      audioSizeBytes: buffer.length
    });
    
    // Return the Base64 encoded audio data
    return {
      audioBase64
    };
  } catch (error) {
    agentResponseLogger.error('Error converting text to speech', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      textResponsePreview: textResponse.substring(0, 30) + '...'
    });
    throw error;
  }
}

/**
 * Uses the LLM to determine appropriate tone and emotion
 * based on the response content and conversation history,
 * but uses the user-specified voice if provided
 */

// // Type for voice settings
// interface VoiceSettings {
//   voice: string;
//   instructions: string;
// }

// async function determineVoiceSettings(
//   textResponse: string,
//   conversationHistory: SimpleMessage[],
//   preferredVoice?: OpenAIVoice
// ): Promise<VoiceSettings> {
//   agentResponseLogger.info('Determining voice settings', {
//     responseLength: textResponse.length,
//     historyLength: conversationHistory.length,
//     preferredVoice
//   });
//
//   try {
//     // Use the user's preferred voice if provided
//     const voice = preferredVoice || "nova"; // Default to "nova" if not specified
//     
//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });
//
//     agentResponseLogger.info('Analyzing conversation for voice instructions', {
//       voice
//     });
//
//     // Create a prompt for the LLM to analyze the conversation and suggest instructions only
//     const voiceAnalysisMessages = [
//       {
//         role: "system" as const,
//         content: `Analyze the following conversation and the assistant's response. 
//           The voice "${voice}" has already been selected.
//           Provide detailed instructions for tone, emotion, speed, and other vocal characteristics
//           that would make this response sound natural and appropriate for the conversation.
//           Respond with just the instructions text.`
//       },
//       {
//         role: "user" as const,
//         content: `Conversation history:
//           ${JSON.stringify(conversationHistory)}
//           
//           Assistant's response to convert to speech:
//           "${textResponse}"
//           
//           Based on this context, what instructions would create the most natural and appropriate speech?`
//       }
//     ];
//
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: voiceAnalysisMessages
//     });
//
//     const instructions = completion.choices[0].message.content || 
//       "Speak in a natural, conversational tone with moderate pacing.";
//
//     agentResponseLogger.info('Voice instructions determined', {
//       voice,
//       instructionsPreview: instructions.substring(0, 50) + '...'
//     });
//
//     return {
//       voice,
//       instructions
//     };
//   } catch (error) {
//     agentResponseLogger.error('Error determining voice settings', {
//       error: error instanceof Error ? error.message : String(error),
//       stack: error instanceof Error ? error.stack : undefined
//     });
//     
//     // Return default settings with the preferred voice in case of error
//     agentResponseLogger.info('Using default voice settings due to error', {
//       voice: preferredVoice || "nova"
//     });
//     
//     return {
//       voice: preferredVoice || "nova",
//       instructions: "Speak in a natural, conversational tone with moderate pacing."
//     };
//   }
// }
