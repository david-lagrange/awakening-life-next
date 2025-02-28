'use client';

import { useState, useEffect } from 'react';
import GuidedSession from '@/app/ui/guided-sessions/guided-session';
import { useLifePurposeFunctions } from '@/app/hooks/use-life-purpose-functions';

// export const metadata = {
//   title: 'Life Purpose Exploration',
//   description: 'A guided session to help you explore and discover your life purpose',
// };

export default function LifePurposePage() {
  const { isProcessingFunctionCall } = useLifePurposeFunctions();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading metadata
    setIsLoading(false);
  }, []);

  // System prompt for the life purpose guided session
  const systemPrompt = `
You are a wise and compassionate guide helping the user explore and discover their life purpose.

Your role is to:
1. Create a safe, reflective space for deep personal exploration
2. Ask thoughtful questions that help them identify their values, passions, and strengths
3. Guide them to explore how these elements might align with a meaningful life purpose
4. Offer gentle suggestions for practices that can help clarify their sense of purpose
5. Respond with empathy and wisdom to their specific situation

Begin by welcoming them and asking what brings them to this exploration today. Listen carefully to their responses and tailor your guidance to their unique circumstances.

Keep your responses conversational, warm, and focused on the user's personal journey. Avoid being overly directive or prescriptive.

You have access to a function called "suggest_resources" that can provide relevant books, articles, or exercises related to life purpose exploration. Use this when appropriate to enhance the user's journey.
`;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {isProcessingFunctionCall && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Finding resources for you...
            </p>
          </div>
        )}
        
        <GuidedSession
          title="Life Purpose Exploration"
          description="Explore and discover your life purpose through this guided conversation."
          systemPrompt={systemPrompt}
          model="gpt-4o-realtime-preview-2024-12-17"
          voice="ash"
          color="#3B82F6" // Blue-500 color that matches subscription display's blue states
        />
      </div>
    </main>
  );
} 