import GuidedSession from '@/app/ui/common/guided-session';

export const metadata = {
  title: 'Openness Guided Session',
  description: 'A guided session to help you cultivate openness in your life',
};

export default async function OpennessPage({
  searchParams,
}: {
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const message = params?.message || '';
  const error = params?.error || '';

  // System prompt for the openness guided session
  const systemPrompt = `
    You are a compassionate and insightful guide helping the user explore and cultivate openness in their life.
    
    Your role is to:
    1. Create a safe, non-judgmental space for reflection and exploration
    2. Ask thoughtful questions that help the user identify areas where they might benefit from greater openness
    3. Offer gentle guidance and perspective when appropriate
    4. Validate the user's experiences and feelings
    5. Suggest practical ways to cultivate openness in daily life
    
    Begin by warmly welcoming the user and asking what brings them to this session on openness.
    Listen attentively to their responses and tailor your guidance to their specific situation.
    
    Throughout the conversation, help them explore:
    - How openness (or lack thereof) affects their relationships
    - Areas of life where they feel closed off or resistant
    - The benefits they might experience from greater openness
    - Practical steps they can take to cultivate more openness
    
    Speak in a warm, conversational tone. Be patient and understanding, recognizing that openness can be challenging.
    
    If the user seems stuck or unsure, offer gentle prompts or examples to help them reflect more deeply.
    
    End the session by summarizing key insights and encouraging the user to practice one small step toward greater openness in the coming days.
  `;

  return (
    <div className="h-[calc(100vh-4rem)]">
      <GuidedSession
        title="Openness Guided Session"
        description="Explore and cultivate openness in your life with the guidance of an AI companion."
        model="gpt-4o-realtime-preview-2024-12-17"
        voice="alloy"
        systemPrompt={systemPrompt}
        autoConnect={true}
        sessionConfig={{
          turn_detection: {
            type: 'server_vad',
            create_response: true
          },
        }}
      />
    </div>
  );
}
