'use client';

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/app/lib/types/realtime';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export default function ChatMessageComponent({ message, isStreaming = false }: ChatMessageProps) {
  const [formattedTime, setFormattedTime] = useState<string>('');
  
  useEffect(() => {
    if (message.timestamp) {
      setFormattedTime(format(new Date(message.timestamp), 'h:mm a'));
    }
  }, [message.timestamp]);
  
  const renderContent = () => {
    if (message.functionCall) {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
          <p className="text-sm font-semibold mb-1">Function Call: {message.functionCall.name}</p>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(JSON.parse(message.functionCall.arguments), null, 2)}
          </pre>
        </div>
      );
    }
    
    if (message.functionResult) {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
          <p className="text-sm font-semibold mb-1">Function Result: {message.functionResult.name}</p>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(JSON.parse(message.functionResult.result), null, 2)}
          </pre>
        </div>
      );
    }
    
    return (
      <div className="whitespace-pre-wrap">
        {message.content}
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-current opacity-75 animate-pulse" />
        )}
      </div>
    );
  };
  
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isFunction = message.role === 'function';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-lg p-4
          ${isUser ? 'bg-blue-500 text-white' : ''}
          ${isAssistant ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}
          ${isFunction ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full' : ''}
        `}
      >
        <div className="flex items-center mb-1">
          <span className="font-semibold text-sm">
            {isUser ? 'You' : isAssistant ? 'AI Assistant' : 'Function'}
          </span>
          {formattedTime && (
            <span className="text-xs ml-2 opacity-70">{formattedTime}</span>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
} 