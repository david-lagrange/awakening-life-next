'use client';

import { useEffect, useRef } from 'react';
import ChatInterface from './chat-interface';
import { FunctionDefinition, RealtimeSession } from '@/app/lib/types/realtime';

export interface GuidedSessionProps {
  title: string;
  description: string;
  systemPrompt: string;
  model?: string;
  voice?: string;
  functions?: FunctionDefinition[];
  autoConnect?: boolean;
  sessionConfig?: Partial<RealtimeSession>;
}

export default function GuidedSession({
  title,
  description,
  systemPrompt,
  model = 'gpt-4o',
  voice = 'alloy',
  functions = [],
  autoConnect = false,
  sessionConfig = {},
}: GuidedSessionProps) {
  // Add a mounted ref to track component lifecycle
  const mountedRef = useRef(true);
  
  // Log component initialization
  console.log('GuidedSession component initialized');
  
  // Set mountedRef to false on unmount
  useEffect(() => {
    console.log('GuidedSession component mounted');
    
    return () => {
      console.log('GuidedSession component unmounting');
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <ChatInterface
          model={model}
          voice={voice}
          initialInstructions={systemPrompt}
          functions={functions}
          autoConnect={autoConnect}
          sessionConfig={sessionConfig}
        />
      </div>
    </div>
  );
} 