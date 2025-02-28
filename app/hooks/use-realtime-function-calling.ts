'use client';

import { useState, useEffect } from 'react';
import { useRealtimeApi } from '@/app/contexts/realtime-api-context';

interface FunctionDefinition {
  type: 'function';
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

interface FunctionCallHandler {
  name: string;
  handler: (args: Record<string, unknown>) => Promise<unknown> | unknown;
}

interface FunctionCall {
  callId: string;
  name: string;
  args: Record<string, unknown>;
}

// Extended interface for RealtimeApiService with the missing method
interface ExtendedRealtimeApi {
  updateSession(config: Record<string, unknown>): void;
  on(eventType: string, callback: (event: Record<string, unknown>) => void): void;
  off(eventType: string, callback: (event: Record<string, unknown>) => void): void;
  createResponse(options?: Record<string, unknown>): void;
  sendFunctionCallOutput(callId: string, result: unknown): void;
}

export function useRealtimeFunctionCalling(
  functionDefinitions: FunctionDefinition[],
  functionHandlers: FunctionCallHandler[]
) {
  const realtimeApi = useRealtimeApi() as unknown as ExtendedRealtimeApi;
  const [isProcessingFunctionCall, setIsProcessingFunctionCall] = useState(false);
  const [currentFunctionCall, setCurrentFunctionCall] = useState<FunctionCall | null>(null);

  // Register function definitions with the Realtime API
  useEffect(() => {
    if (functionDefinitions.length > 0) {
      realtimeApi.updateSession({
        tools: functionDefinitions,
        tool_choice: 'auto',
      });
    }
  }, [realtimeApi, functionDefinitions]);

  // Handle function call events from the Realtime API
  useEffect(() => {
    const handleResponseDone = (event: Record<string, unknown>) => {
      // Check if the response contains a function call
      const response = event.response as Record<string, unknown> | undefined;
      const output = response?.output as Array<Record<string, unknown>> | undefined;
      const functionCall = output?.find((item) => item.type === 'function_call');
      
      if (functionCall) {
        try {
          const args = JSON.parse(functionCall.arguments as string);
          setCurrentFunctionCall({
            callId: functionCall.call_id as string,
            name: functionCall.name as string,
            args,
          });
          setIsProcessingFunctionCall(true);
        } catch (error) {
          console.error('Error parsing function call arguments:', error);
        }
      }
    };

    realtimeApi.on('response.done', handleResponseDone);

    return () => {
      realtimeApi.off('response.done', handleResponseDone);
    };
  }, [realtimeApi]);

  // Execute function call and send result back to the Realtime API
  useEffect(() => {
    const executeFunctionCall = async () => {
      if (!currentFunctionCall) return;

      try {
        // Find the handler for this function
        const handler = functionHandlers.find(h => h.name === currentFunctionCall.name);
        
        if (!handler) {
          throw new Error(`No handler found for function: ${currentFunctionCall.name}`);
        }

        // Execute the function
        const result = await handler.handler(currentFunctionCall.args);
        
        // Send the result back to the Realtime API
        realtimeApi.sendFunctionCallOutput(
          currentFunctionCall.callId,
          result
        );

        // Generate a response based on the function call result
        realtimeApi.createResponse();
        
      } catch (error) {
        console.error('Error executing function call:', error);
        
        // Send error back to the Realtime API
        realtimeApi.sendFunctionCallOutput(
          currentFunctionCall.callId,
          { error: 'Function execution failed' }
        );
        
      } finally {
        setIsProcessingFunctionCall(false);
        setCurrentFunctionCall(null);
      }
    };

    if (currentFunctionCall && isProcessingFunctionCall) {
      executeFunctionCall();
    }
  }, [currentFunctionCall, isProcessingFunctionCall, functionHandlers, realtimeApi]);

  return {
    isProcessingFunctionCall,
    currentFunctionCall,
  };
} 