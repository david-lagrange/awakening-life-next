'use client';

import { useRealtimeFunctionCalling } from '@/app/hooks/use-realtime-function-calling';

// Resource database (in a real app, this would come from an API or database)
const resourceDatabase = {
  books: {
    'finding meaning': [
      { title: 'Man\'s Search for Meaning', author: 'Viktor E. Frankl' },
      { title: 'The Power of Purpose', author: 'Richard J. Leider' },
    ],
    'career purpose': [
      { title: 'Designing Your Life', author: 'Bill Burnett & Dave Evans' },
      { title: 'The Element', author: 'Ken Robinson' },
    ],
    'spiritual purpose': [
      { title: 'The Purpose Driven Life', author: 'Rick Warren' },
      { title: 'A New Earth', author: 'Eckhart Tolle' },
    ],
  },
  articles: {
    'finding meaning': [
      { title: 'The Science of Finding Your Life\'s Purpose', source: 'Psychology Today' },
      { title: 'How to Find Your Purpose in Life', source: 'Greater Good Magazine' },
    ],
    'career purpose': [
      { title: 'How to Find Meaningful Work', source: 'Harvard Business Review' },
      { title: 'Finding Purpose at Work', source: 'Forbes' },
    ],
    'spiritual purpose': [
      { title: 'Spiritual Growth and Finding Your Purpose', source: 'Mindful' },
      { title: 'The Spiritual Journey of Purpose', source: 'Spirituality & Health' },
    ],
  },
  exercises: {
    'finding meaning': [
      { title: 'Values Clarification Exercise', description: 'Identify your core values and how they align with your purpose' },
      { title: 'The "Perfect Day" Visualization', description: 'Visualize your ideal day to uncover what truly matters to you' },
    ],
    'career purpose': [
      { title: 'Ikigai Diagram', description: 'Map what you love, what you\'re good at, what the world needs, and what you can be paid for' },
      { title: 'Career Values Assessment', description: 'Identify what you value most in your work environment' },
    ],
    'spiritual purpose': [
      { title: 'Meditation on Purpose', description: 'A guided meditation to connect with your deeper sense of purpose' },
      { title: 'Gratitude Journal', description: 'Daily practice to cultivate awareness of what gives your life meaning' },
    ],
  },
};

// Define types for resources
// type ResourceTopic = 'finding meaning' | 'career purpose' | 'spiritual purpose';
type ResourceType = 'books' | 'articles' | 'exercises' | 'all';

interface SuggestResourcesArgs {
  topic: string;
  resource_type?: ResourceType;
}

interface SuggestResourcesResult {
  topic: string;
  books?: Array<{ title: string; author: string }>;
  articles?: Array<{ title: string; source: string }>;
  exercises?: Array<{ title: string; description: string }>;
}

export function useLifePurposeFunctions() {
  // Function to suggest resources based on user interests
  const suggestResources = async (args: SuggestResourcesArgs): Promise<SuggestResourcesResult> => {
    const { topic, resource_type = 'all' } = args;
    
    // Find the closest matching topic
    const topics = ['finding meaning', 'career purpose', 'spiritual purpose'];
    const matchedTopic = topics.find(t => 
      topic.toLowerCase().includes(t) || t.includes(topic.toLowerCase())
    ) || 'finding meaning'; // Default to 'finding meaning' if no match
    
    // Gather resources based on resource_type
    const result: SuggestResourcesResult = { topic: matchedTopic };
    
    if (resource_type === 'all' || resource_type === 'books') {
      result.books = resourceDatabase.books[matchedTopic as keyof typeof resourceDatabase.books] || [];
    }
    
    if (resource_type === 'all' || resource_type === 'articles') {
      result.articles = resourceDatabase.articles[matchedTopic as keyof typeof resourceDatabase.articles] || [];
    }
    
    if (resource_type === 'all' || resource_type === 'exercises') {
      result.exercises = resourceDatabase.exercises[matchedTopic as keyof typeof resourceDatabase.exercises] || [];
    }
    
    return result;
  };

  // Function definitions
  const functionDefinitions = [
    {
      type: 'function' as const,
      name: 'suggest_resources',
      description: 'Suggest resources related to life purpose exploration based on user interests',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'The specific topic or area of life purpose the user is interested in',
          },
          resource_type: {
            type: 'string',
            enum: ['books', 'articles', 'exercises', 'all'],
            description: 'The type of resources to suggest',
          },
        },
        required: ['topic'],
      },
    },
  ];

  // Function handlers
  const functionHandlers = [
    {
      name: 'suggest_resources',
      handler: suggestResources as unknown as (args: Record<string, unknown>) => Promise<unknown>,
    },
  ];

  // Use the realtime function calling hook
  return useRealtimeFunctionCalling(functionDefinitions, functionHandlers);
} 