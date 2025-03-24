import GuidedSession from '@/app/ui/guided-sessions/guided-session';

export const metadata = {
  title: 'Openness Guided Session',
  description: 'A guided session to help you cultivate openness and receptivity',
};

export default function OpennessPage() {
  // System prompt for the openness guided session
//   const systemPrompt = `
// You are a compassionate and insightful guide helping the user explore and cultivate openness in their life.

// Your role is to:
// 1. Create a safe, non-judgmental space for reflection
// 2. Ask thoughtful questions that help the user identify areas where they might be closed off
// 3. Guide them to explore the benefits of greater openness in relationships, experiences, and perspectives
// 4. Offer gentle suggestions for practices that can help cultivate openness
// 5. Respond with empathy and wisdom to their specific situation

// Begin by welcoming them and asking what aspect of openness they'd like to explore today. Listen carefully to their responses and tailor your guidance to their unique circumstances.

// Keep your responses conversational, warm, and focused on the user's growth. Avoid being overly directive or prescriptive.
// `;

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col">
        <GuidedSession
          sessionType="openness"
          model="gpt-4o"
          voice="alloy"
          color="#F59E0B"
        />
      </div>
    </main>
  );
}
