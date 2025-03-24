import { NextRequest, NextResponse } from 'next/server';
import logger from '@/app/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level, message, component, context, data, timestamp } = body;
    
    const clientLogger = logger.child({ 
      source: 'client', 
      component, 
      ...context 
    });
    
    switch (level) {
      case 'debug':
        clientLogger.debug(message, { timestamp, ...data });
        break;
      case 'info':
        clientLogger.info(message, { timestamp, ...data });
        break;
      case 'warn':
        clientLogger.warn(message, { timestamp, ...data });
        break;
      case 'error':
        clientLogger.error(message, { timestamp, ...data });
        break;
      default:
        clientLogger.info(message, { timestamp, ...data });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error processing client log', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 