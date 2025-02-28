# Awakening Life - Next.js Application with OpenAI Realtime API

This application uses OpenAI's Realtime API to provide guided sessions for various purposes such as openness, life purpose/vision seeking, guided contemplation, daily gratitude, mind clearing, and more.

## Features

- Real-time voice interaction with OpenAI's Realtime API
- Text streaming for chat messages
- WebRTC integration for low-latency audio
- Function calling support for extending AI capabilities
- Reusable components for different types of guided sessions

## Getting Started

### Prerequisites

- Node.js 18.x or later
- An OpenAI API key with access to the Realtime API (beta feature)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Copy the `.env.local.example` file to `.env.local` and add your OpenAI API key:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Guided Sessions

The application includes several guided sessions:

- **Openness**: Explore and cultivate openness in your life
- (More sessions to be added)

## Creating a New Guided Session

To create a new guided session:

1. Create a new directory in the `app` folder for your session (e.g., `app/life-purpose`)
2. Create a `page.tsx` file in the new directory
3. Use the `GuidedSession` component with appropriate props:

```tsx
import GuidedSession from '@/app/ui/common/guided-session';

export const metadata = {
  title: 'Your Session Title',
  description: 'Description of your guided session',
};

export default async function YourSessionPage({
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

  // System prompt for your guided session
  const systemPrompt = `
    Your system prompt instructions here...
  `;

  return (
    <div className="h-[calc(100vh-4rem)]">
      <GuidedSession
        title="Your Session Title"
        description="Description of your guided session"
        model="gpt-4o-realtime-preview-2024-12-17"
        voice="alloy" // Options: alloy, echo, fable, onyx, nova, shimmer
        systemPrompt={systemPrompt}
        sessionConfig={{
          // Optional configuration
          turn_detection: {
            mode: 'auto',
            create_response: true,
          },
        }}
      />
    </div>
  );
}
```

## Adding Function Calling

To add function calling capabilities to a guided session:

1. Define your functions:

```tsx
const functions: FunctionDefinition[] = [
  {
    name: 'get_weather',
    description: 'Get the current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g. San Francisco, CA',
        },
      },
      required: ['location'],
    },
    handler: async (args) => {
      // Implement your function logic here
      return { temperature: 72, conditions: 'sunny' };
    },
  },
];
```

2. Pass the functions to the `GuidedSession` component:

```tsx
<GuidedSession
  // ... other props
  functions={functions}
/>
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for the Realtime API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling