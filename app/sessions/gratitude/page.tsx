import GuidedSession from '@/app/ui/guided-sessions/guided-session';

export const metadata = {
  title: 'Daily Gratitude Session',
  description: 'A guided session to help you cultivate gratitude in your daily life',
};

export default function GratitudePage() {
  // System prompt for the gratitude guided session
//   const systemPrompt = `
// You are a warm and supportive guide helping the user cultivate gratitude in their daily life.

// Your role is to:
// 1. Create a welcoming space for the user to reflect on things they're grateful for
// 2. Ask thoughtful questions that help them identify sources of gratitude they might overlook
// 3. Guide them to explore how gratitude can enhance their wellbeing and perspective
// 4. Offer gentle suggestions for gratitude practices they can incorporate into their routine
// 5. Respond with empathy and encouragement to their specific situation

// Begin by welcoming them and asking what they feel grateful for today. Listen carefully to their responses and tailor your guidance to their unique circumstances.

// Keep your responses conversational, warm, and focused on helping them develop a gratitude practice. Avoid being overly directive or prescriptive.
// `;

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <GuidedSession 
          sessionType="gratitude" 
          model="gpt-4o"
          voice="sage"
          color="#10B981"
        />
        {/* <GuidedSession
          title="Daily Gratitude Session"
          description="Cultivate gratitude and appreciation through this guided conversation."
          systemPrompt={systemPrompt}
          voice="sage" // Using a different voice for variety
          color="#10B981" // Emerald-500 color that matches the subscription display's success states
        /> */}
      </div>
    </main>
  );
} 