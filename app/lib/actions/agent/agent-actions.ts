"use server";

import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources/chat/completions";
import { createLogger } from '@/app/lib/logger';

// Create component-specific logger
const agentLogger = createLogger('[SERVER] AgentActions');

// Define a simplified message type that will serialize properly
interface SimpleMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Server action to send messages to the LLM and get responses
export async function agentProcessMessages(
  messages: SimpleMessage[], 
  model: string = "gpt-4o" // Add model parameter with default
) {
  agentLogger.info('Processing agent messages', { 
    messageCount: messages.length,
    firstMessagePreview: messages.length > 0 ? 
      `${messages[0].role}: ${messages[0].content.substring(0, 30)}...` : 'None',
    model
  });
  
  try {
    // Initialize OpenAI client (only on server)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    agentLogger.debug('Messages received', { 
      messageCount: messages.length,
      messagePreviews: messages.map(m => `${m.role}: ${m.content.substring(0, 30)}...`)
    });

    // Prepend a system message if needed
    const formattedMessages = [...messages]; // Clone to avoid modifying the input

    // Add system message if needed
    if (!formattedMessages.some(msg => msg.role === 'system')) {
      agentLogger.debug('Adding system message as none was provided');
      formattedMessages.unshift({
        role: "system",
        content: "You are a helpful assistant engaging in a conversation with the user. Maintain context from the entire conversation history."
      });
    }

    // Define the tools/functions the LLM can call with correct typing
    const tools: ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "adjust_volume",
          description: "Adjust the volume of the audio playback",
          parameters: {
            type: "object",
            properties: {
              level: {
                type: "number",
                description: "Volume level from 0 (mute) to 100 (max)",
              },
            },
            required: ["level"],
          },
        },
      },
    ];

    agentLogger.info('Calling OpenAI API', {
      model: model,
      messageCount: formattedMessages.length,
      toolsCount: tools.length
    });

    // Call the OpenAI API with the specified model
    const completion = await openai.chat.completions.create({
      model: model,
      messages: formattedMessages,
      tools: tools,
    });

    // Extract the response
    const assistantResponse = completion.choices[0].message;
    
    agentLogger.info('Received response from OpenAI', {
      hasContent: !!assistantResponse.content,
      hasToolCalls: !!assistantResponse.tool_calls && assistantResponse.tool_calls.length > 0,
      contentPreview: assistantResponse.content ? 
        `${assistantResponse.content.substring(0, 30)}...` : 'None',
      toolCallsCount: assistantResponse.tool_calls?.length || 0
    });
    
    // Handle tool calls if present
    if (assistantResponse.tool_calls && assistantResponse.tool_calls.length > 0) {
      agentLogger.info('Processing tool calls', { 
        toolCallsCount: assistantResponse.tool_calls.length 
      });
      
      // Process each tool call
      for (const toolCall of assistantResponse.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        agentLogger.info('Tool call details', { 
          functionName, 
          functionArgs 
        });
        // Here you would actually execute the function
        // executeFunction(functionName, functionArgs);
      }
    }

    // Return both the text response and any tool calls
    return {
      textResponse: assistantResponse.content || "",
      toolCalls: assistantResponse.tool_calls || [],
    };
  } catch (error) {
    agentLogger.error('Error processing agent messages', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

// Future implementation: Function to execute the tool calls
// export async function executeFunction(functionName: string, args: any) {
//   agentLogger.info('Executing function', { functionName, args });
//   switch (functionName) {
//     case "adjust_volume":
//       // Implement volume adjustment logic
//       agentLogger.info('Volume adjustment requested', { level: args.level });
//       return { success: true, message: `Volume adjusted to ${args.level}` };
//     default:
//       agentLogger.warn('Unknown function call requested', { functionName });
//       return { success: false, message: `Unknown function: ${functionName}` };
//   }
// } 