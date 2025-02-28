import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { model = 'gpt-4o-realtime-preview-2024-12-17', voice = 'alloy' } = body;

    // Log the request for debugging (remove in production)
    console.log('Creating realtime session with model:', model, 'and voice:', voice);

    // Request an ephemeral key from OpenAI
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-realtime-preview-2024-12-17',
        voice,
      }),
    });

    // Log the response status for debugging
    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create realtime session', details: errorData },
        { status: response.status }
      );
    }

    // Return the ephemeral key to the client
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error creating realtime session:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 