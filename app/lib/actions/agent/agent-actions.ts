"use server";

import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources/chat/completions";

// Define a simplified message type that will serialize properly
interface SimpleMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Server action to send messages to the LLM and get responses
export async function sendMessagesToLLM(messages: SimpleMessage[]) {
  try {
    // Initialize OpenAI client (only on server)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("Number of messages received by server action:", messages.length);
    console.log("Messages received:", messages.map(m => `${m.role}: ${m.content.substring(0, 30)}...`));

    // Prepend a system message if needed
    const formattedMessages = [...messages]; // Clone to avoid modifying the input

    // Add system message if needed
    if (!formattedMessages.some(msg => msg.role === 'system')) {
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

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: formattedMessages,
      tools: tools,
    });

    // Extract the response
    const assistantResponse = completion.choices[0].message;
    
    // Handle tool calls if present
    if (assistantResponse.tool_calls && assistantResponse.tool_calls.length > 0) {
      console.log("Tool calls detected:", assistantResponse.tool_calls);
      
      // Process each tool call
      for (const toolCall of assistantResponse.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        console.log(`Function call: ${functionName}`, functionArgs);
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
    console.error("Error sending messages to LLM:", error);
    throw error;
  }
}

// Future implementation: Function to execute the tool calls
// export async function executeFunction(functionName: string, args: any) {
//   switch (functionName) {
//     case "adjust_volume":
//       // Implement volume adjustment logic
//       return { success: true, message: `Volume adjusted to ${args.level}` };
//     default:
//       return { success: false, message: `Unknown function: ${functionName}` };
//   }
// } 