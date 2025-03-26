import GuidedSession from '@/app/ui/guided-sessions/guided-session';

export const metadata = {
  title: 'Daily Gratitude Session',
  description: 'A guided session to help you cultivate gratitude in your daily life',
};

export default function GratitudePage() {
  // Define the sessionTypeId for gratitude sessions
  const gratitudeSessionTypeId = "facc0a25-c977-4f95-a2e6-93751064ff37";

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <GuidedSession 
          sessionTypeId={gratitudeSessionTypeId}
          model="gpt-4o"
          voice="sage"
          color="#10B981"
        />
      </div>
    </main>
  );
} 