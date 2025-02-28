'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRealtimeApi } from '@/app/contexts/realtime-api-context';

interface FunctionDefinition {
  type: 'function';
  name: string;
  description: string;
  parameters: any;
}

interface FunctionCallHandler {
  name: string;
  handler: (args: any) => Promise<any> | any;
}

export function useRealtimeFunctionCalling(
  functionDefinitions: FunctionDefinition[],
  functionHandlers: FunctionCallHandler[]
) {
  const realtimeApi = useRealtimeApi();
  const [isProcessingFunctionCall, setIsProcessingFunctionCall] = useState(false);
  const [currentFunctionCall, setCurrentFunctionCall] = useState<{
    callId: string;
    name: string;
    args: any;
  } | null>(null);

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
    const handleResponseDone = (event: any) => {
      // Check if the response contains a function call
      const functionCall = event.response?.output?.find((item: any) => item.type === 'function_call');
      
      if (functionCall) {
        try {
          const args = JSON.parse(functionCall.arguments);
          setCurrentFunctionCall({
            callId: functionCall.call_id,
            name: functionCall.name,
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