"use server";

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// Define message types for consistency with agent-actions.ts
interface SimpleMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// // Type for voice settings
// interface VoiceSettings {
//   voice: string;
//   instructions: string;
// }

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
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("🔷 [convertResponseToSpeech] textResponse:", textResponse);
    console.log("🔷 [convertResponseToSpeech] conversationHistory:", conversationHistory);
    console.log("🔷 [convertResponseToSpeech] voicePreference:", voicePreference);
    // Step 1: Determine appropriate voice settings based on conversation context
    // const voiceSettings = await determineVoiceSettings(
    //   textResponse, 
    //   conversationHistory,
    //   voicePreference
    // );
    

    const voiceSettings = {
      voice: "nova",
      instructions: `Voice Affect: Soft, gentle, soothing; embody tranquility.

        Tone: Calm, reassuring, peaceful; convey genuine warmth and serenity.

        Pacing: Slow, deliberate, and unhurried; pause gently after instructions to allow the listener time to relax and follow along.

        Emotion: Deeply soothing and comforting; express genuine kindness and care.

        Pronunciation: Smooth, soft articulation, slightly elongating vowels to create a sense of ease.

        Pauses: Use thoughtful pauses, especially between breathing instructions and visualization guidance, enhancing relaxation and mindfulness.`
    };

    console.log("Using voice settings:", voiceSettings);

    // Step 2: Generate speech using OpenAI's TTS API
    const speechResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voiceSettings.voice as OpenAIVoice,
      input: textResponse,
      instructions: voiceSettings.instructions,
    });

    // Step 3: Convert to buffer and then to Base64 for direct playback
    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    const audioBase64 = buffer.toString('base64');
    
    // Return the Base64 encoded audio data
    return {
      audioBase64
    };
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw error;
  }
}

/**
 * Uses the LLM to determine appropriate tone and emotion
 * based on the response content and conversation history,
 * but uses the user-specified voice if provided
 */
// async function determineVoiceSettings(
//   textResponse: string,
//   conversationHistory: SimpleMessage[],
//   preferredVoice?: OpenAIVoice
// ): Promise<VoiceSettings> {
//   try {
//     // Use the user's preferred voice if provided
//     const voice = preferredVoice || "nova"; // Default to "nova" if not specified
    
//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });

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
          
//           Assistant's response to convert to speech:
//           "${textResponse}"
          
//           Based on this context, what instructions would create the most natural and appropriate speech?`
//       }
//     ];

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: voiceAnalysisMessages
//     });

//     const instructions = completion.choices[0].message.content || 
//       "Speak in a natural, conversational tone with moderate pacing.";

//     console.log("Voice Instructions:", instructions);

//     return {
//       voice,
//       instructions
//     };
//   } catch (error) {
//     console.error("Error determining voice settings:", error);
    
//     // Return default settings with the preferred voice in case of error
//     return {
//       voice: preferredVoice || "nova",
//       instructions: "Speak in a natural, conversational tone with moderate pacing."
//     };
//   }
// }

/**
 * Cleans up old audio files to manage storage
 * Can be called periodically or after sessions end
 */
export async function cleanupAudioFiles(maxAgeHours: number = 24): Promise<void> {
  try {
    const publicDir = path.join(process.cwd(), "public", "audio-responses");
    
    // Skip if directory doesn't exist
    if (!fs.existsSync(publicDir)) {
      return;
    }
    
    const files = await fs.promises.readdir(publicDir);
    const now = Date.now();
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    
    for (const file of files) {
      if (file.startsWith('response_') && file.endsWith('.mp3')) {
        const filePath = path.join(publicDir, file);
        const stats = await fs.promises.stat(filePath);
        
        // Delete files older than maxAgeHours
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.promises.unlink(filePath);
          console.log(`Deleted old audio file: ${file}`);
        }
      }
    }
  } catch (error) {
    console.error("Error cleaning up audio files:", error);
  }
} 