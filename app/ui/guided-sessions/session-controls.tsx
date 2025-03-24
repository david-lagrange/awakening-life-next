"use client";

import { 
  MicrophoneIcon, 
  StopIcon, 
  ArrowPathIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { TranscriptionStatus } from "@/app/lib/services/transcription";

interface SessionControlsProps {
  status: TranscriptionStatus;
  error: string | null;
  startSession: () => void;
  stopSession: () => void;
  toggleChat: () => void;
  color?: string;
}

export default function SessionControls({ 
  status, 
  error, 
  startSession, 
  stopSession, 
  toggleChat,
  color = "#3B82F6"
}: SessionControlsProps) {
  const isLoading = status === 'connecting';
  const isSessionActive = status === 'active';
  const circleColor = color;
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Guided Session</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Record your thoughts and receive guidance</p>
      </div>
      
      {/* Status Circle */}
      <div className="mb-8">
        {isSessionActive ? (
          <div 
            className="w-32 h-32 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: circleColor,
              boxShadow: `0 0 30px ${circleColor}`
            }}
          >
            <MicrophoneIcon className="h-12 w-12 text-white animate-pulse" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 
                border border-blue-200/50 dark:border-blue-800/30 shadow-sm flex items-center justify-center
                transition-all duration-300 hover:shadow-md group-hover:border-blue-300 dark:group-hover:border-blue-700">
                {isLoading ? (
                  <ArrowPathIcon className="h-10 w-10 text-blue-500 dark:text-blue-400 animate-spin" />
                ) : (
                  <MicrophoneIcon className="h-12 w-12 text-blue-500 dark:text-blue-400 transition-transform 
                    duration-300 group-hover:scale-110" aria-hidden="true" />
                )}
              </div>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm tracking-wide">
              {isLoading ? "Connecting..." : "Start Session"}
            </span>
          </div>
        )}
      </div>
      
      {/* Control Buttons */}
      <div className="mb-16 flex justify-center">
        <div className="flex space-x-6">
          {/* Start Session button */}
          <div className="flex flex-col items-center">
            <button
              onClick={startSession}
              disabled={isSessionActive || isLoading}
              className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
                border border-blue-300 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200 dark:hover:bg-blue-800/40 
                transition-colors"
              aria-label="Start session"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <MicrophoneIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {isLoading ? "Connecting..." : "Start"}
            </span>
          </div>
          
          {/* End Session button */}
          <div className="flex flex-col items-center">
            <button
              onClick={stopSession}
              disabled={!isSessionActive || isLoading}
              className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 
                border border-red-300 dark:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/40
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-200 dark:hover:bg-red-800/40
                transition-colors"
              aria-label="End session"
            >
              <StopIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">End</span>
          </div>
          
          {/* Chat button */}
          <div className="flex flex-col items-center">
            <button
              onClick={toggleChat}
              className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
                border border-blue-300 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40
                hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
              aria-label="Toggle chat"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">Chat</span>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-8 max-w-md bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md p-4">
          <div className="flex items-start">
            <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
} 