import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes (increased from 1 minute)
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per 5 minutes (increased from 5 per minute)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const now = Date.now();
    const rateLimitEntry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
    
    // Reset counter if window has expired
    if (rateLimitEntry.resetAt <= now) {
      rateLimitEntry.count = 0;
      rateLimitEntry.resetAt = now + RATE_LIMIT_WINDOW;
    }
    
    // Increment counter
    rateLimitEntry.count++;
    rateLimitMap.set(ip, rateLimitEntry);
    
    // Check if rate limit exceeded
    if (rateLimitEntry.count > MAX_REQUESTS_PER_WINDOW) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitEntry.resetAt - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitEntry.resetAt - now) / 1000).toString()
          }
        }
      );
    }
    
    // Get the model and voice from the request body
    const { model, voice, instructions } = await req.json();

    // Validate the model and voice
    if (!model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    // Make a request to the OpenAI API to create a session
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        voice: voice || 'alloy',
        ...(instructions && { instructions }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to create session' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 