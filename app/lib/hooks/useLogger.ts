import { useCallback } from 'react';

// Define a type for log data to replace any
type LogData = Record<string, unknown>;

// Client-side logger that sends logs to the server
export function useLogger(component: string, context: LogData = {}) {
  const logToServer = useCallback(
    async (level: string, message: string, data?: LogData) => {
      try {
        await fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level,
            message,
            component,
            context,
            data,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error: unknown) {
        // Fallback to console if server logging fails
        console.error('Failed to send log to server:', error);
      }
    },
    [component, context]
  );

  // Return a typed logger interface
  return {
    debug: (message: string, data?: LogData) => logToServer('debug', message, data),
    info: (message: string, data?: LogData) => logToServer('info', message, data),
    warn: (message: string, data?: LogData) => logToServer('warn', message, data),
    error: (message: string, data?: LogData) => logToServer('error', message, data),
  };
} 