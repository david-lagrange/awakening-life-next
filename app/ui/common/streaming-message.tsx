'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface StreamingMessageProps {
  content: string;
  timestamp?: number;
}

export default function StreamingMessage({ content, timestamp }: StreamingMessageProps) {
  const [formattedTime, setFormattedTime] = useState<string>('');
  
  // Log when the component renders with new content
  useEffect(() => {
    console.log('StreamingMessage rendering with content:', content);
  }, [content]);
  
  useEffect(() => {
    if (timestamp) {
      setFormattedTime(format(new Date(timestamp), 'h:mm a'));
    } else {
      setFormattedTime(format(new Date(), 'h:mm a'));
    }
  }, [timestamp]);
  
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 max-w-[80%] rounded-lg p-4">
        <div className="flex items-center mb-1">
          <span className="font-semibold text-sm">AI Assistant</span>
          {formattedTime && (
            <span className="text-xs ml-2 opacity-70">{formattedTime}</span>
          )}
        </div>
        <div className="whitespace-pre-wrap">
          {content || 'Thinking...'}
          <span className="inline-block w-2 h-4 ml-1 bg-current opacity-75 animate-pulse" />
        </div>
      </div>
    </div>
  );
} 