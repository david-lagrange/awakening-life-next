import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Check if the OpenAI API key is set
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not set in environment variables' },
        { status: 500 }
      );
    }
    
    // Test the OpenAI API key with a simple request
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: 'OpenAI API key is not working',
          details: errorData,
          status: response.status,
          statusText: response.statusText
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'OpenAI API key is working',
      apiKeyFirstFour: apiKey.substring(0, 4) + '...',
      models: data.data.slice(0, 5).map((model: any) => model.id),
    });
  } catch (error) {
    console.error('Error testing OpenAI API key:', error);
    return NextResponse.json(
      { 
        error: 'Error testing OpenAI API key',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 