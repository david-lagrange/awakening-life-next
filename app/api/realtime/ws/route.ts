import { NextRequest } from 'next/server';

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes (increased from 1 minute)
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per 5 minutes (increased from 10 per minute)

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
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitEntry.resetAt - now) / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitEntry.resetAt - now) / 1000).toString()
          }
        }
      );
    }
    
    const { ephemeralKey, model, sdp } = await req.json();

    if (!ephemeralKey || !model || !sdp) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400 }
      );
    }

    const baseUrl = "https://api.openai.com/v1/realtime";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: sdp,
      headers: {
        Authorization: `Bearer ${ephemeralKey}`,
        "Content-Type": "application/sdp"
      },
    });

    if (!sdpResponse.ok) {
      const errorText = await sdpResponse.text();
      return new Response(
        JSON.stringify({ error: errorText }),
        { status: sdpResponse.status }
      );
    }

    const answer = await sdpResponse.text();
    return new Response(answer, {
      headers: {
        'Content-Type': 'application/sdp'
      }
    });
  } catch (error) {
    console.error('Error in WebRTC signaling:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 