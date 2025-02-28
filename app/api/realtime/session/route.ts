import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Add more detailed logging
    console.log('Environment check: API key exists:', !!apiKey);
    
    if (!apiKey) {
      console.error('OpenAI API key not configured in environment variables');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { model = 'gpt-4o-realtime-preview-2024-12-17', voice = 'alloy' } = body;

    // Log the request for debugging
    console.log('Creating realtime session with model:', model, 'and voice:', voice);

    try {
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

      // Get the response text for better error reporting
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error('OpenAI API error:', responseText);
        return NextResponse.json(
          { 
            error: 'Failed to create realtime session', 
            status: response.status,
            details: responseText 
          },
          { status: response.status }
        );
      }

      // Parse the JSON response
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Fetch error when calling OpenAI API:', fetchError);
      return NextResponse.json(
        { 
          error: 'Error communicating with OpenAI API', 
          details: fetchError instanceof Error ? fetchError.message : String(fetchError) 
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error creating realtime session:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 