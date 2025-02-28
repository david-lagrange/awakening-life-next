'use client';

import { createContext, useContext, ReactNode } from 'react';
import { RealtimeApiService, realtimeApiService } from '@/app/lib/services/realtime-api-service';

// Create context
const RealtimeApiContext = createContext<RealtimeApiService | null>(null);

// Provider component
export function RealtimeApiProvider({ children }: { children: ReactNode }) {
  return (
    <RealtimeApiContext.Provider value={realtimeApiService}>
      {children}
    </RealtimeApiContext.Provider>
  );
}

// Hook to use the Realtime API service
export function useRealtimeApi() {
  const context = useContext(RealtimeApiContext);
  if (!context) {
    throw new Error('useRealtimeApi must be used within a RealtimeApiProvider');
  }
  return context;
} 