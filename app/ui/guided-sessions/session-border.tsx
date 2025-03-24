"use client";

import { useEffect } from "react";
import { TranscriptionStatus } from "@/app/lib/services/transcription";

interface SessionBorderProps {
  status: TranscriptionStatus;
  color?: string;
  isAISpeaking?: boolean;
  isSpeechDetected?: boolean;
}

export default function SessionBorder({ 
  status,
  color = "#FFFFFF",
  isAISpeaking = false,
  isSpeechDetected = false
}: SessionBorderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let borderElement = document.getElementById('session-active-border');
      
      if (status === 'active') {
        // Determine border color based on state
        let borderColor = '#FFFFFF'; // Default white for idle
        
        if (isSpeechDetected) {
          borderColor = '#3B82F6'; // Blue when user is speaking/AI is listening
        } else if (isAISpeaking) {
          borderColor = color || '#FFFFFF'; // Use custom color when AI is speaking
        }
        
        if (!borderElement) {
          // Create border element if it doesn't exist
          borderElement = document.createElement('div');
          borderElement.id = 'session-active-border';
          borderElement.style.position = 'fixed';
          borderElement.style.top = '0';
          borderElement.style.left = '0';
          borderElement.style.right = '0';
          borderElement.style.bottom = '0';
          borderElement.style.pointerEvents = 'none';
          borderElement.style.zIndex = '9999';
          borderElement.style.border = 'none';
          document.body.appendChild(borderElement);
          
          // Create animation style element with transition on :root
          const styleElement = document.createElement('style');
          styleElement.id = 'session-border-style';
          styleElement.textContent = `
            :root {
              --border-color: ${borderColor};
              --border-color-alpha: ${borderColor}80;
              transition: --border-color 2s ease, --border-color-alpha 2s ease;
            }
            
            #session-active-border {
              box-shadow: 0 0 15px 0 var(--border-color-alpha), inset 0 0 15px 0 var(--border-color-alpha);
              animation: borderPulse 2s infinite ease-in-out;
            }
            
            @keyframes borderPulse {
              0% { 
                box-shadow: 0 0 15px 0 var(--border-color-alpha), inset 0 0 15px 0 var(--border-color-alpha);
              }
              50% { 
                box-shadow: 0 0 20px 2px var(--border-color), inset 0 0 20px 2px var(--border-color);
              }
              100% { 
                box-shadow: 0 0 15px 0 var(--border-color-alpha), inset 0 0 15px 0 var(--border-color-alpha);
              }
            }
            
            #session-active-border::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: radial-gradient(
                circle at center,
                transparent 30%,
                ${borderColor}00 70%,
                ${borderColor}20 90%,
                ${borderColor}40 100%
              );
              pointer-events: none;
              animation: gradientPulse 2s infinite ease-in-out;
            }
            
            @keyframes gradientPulse {
              0% { opacity: 0.4; }
              50% { opacity: 0.7; }
              100% { opacity: 0.4; }
            }
          `;
          document.head.appendChild(styleElement);
        }
        
        // For the more complex gradient background, recreate it each time
        const styleElement = document.getElementById('session-border-style');
        if (styleElement) {
          styleElement.textContent = `
            :root {
              --border-color: ${borderColor};
              --border-color-alpha: ${borderColor}80;
              transition: --border-color 2s ease, --border-color-alpha 2s ease;
            }
            
            #session-active-border {
              box-shadow: 0 0 15px 0 var(--border-color-alpha), inset 0 0 15px 0 var(--border-color-alpha);
              animation: borderPulse 2s infinite ease-in-out;
              transition: box-shadow 2s ease;
            }
            
            @keyframes borderPulse {
              0% { 
                box-shadow: 0 0 15px 0 var(--border-color-alpha), inset 0 0 15px 0 var(--border-color-alpha);
              }
              50% { 
                box-shadow: 0 0 20px 2px var(--border-color), inset 0 0 20px 2px var(--border-color);
              }
              100% { 
                box-shadow: 0 0 15px 0 var(--border-color-alpha), inset 0 0 15px 0 var(--border-color-alpha);
              }
            }
            
            #session-active-border::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: radial-gradient(
                circle at center,
                transparent 30%,
                ${borderColor}00 70%,
                ${borderColor}20 90%,
                ${borderColor}40 100%
              );
              pointer-events: none;
              animation: gradientPulse 2s infinite ease-in-out;
              transition: background 2s ease;
            }
            
            @keyframes gradientPulse {
              0% { opacity: 0.4; }
              50% { opacity: 0.7; }
              100% { opacity: 0.4; }
            }
          `;
        }
      } else {
        // Remove the border when session is not active
        if (borderElement) {
          borderElement.remove();
          
          // Also remove the style element
          const styleElement = document.getElementById('session-border-style');
          if (styleElement) {
            styleElement.remove();
          }
        }
      }
    }
    
    // Cleanup on unmount
    return () => {
      const borderElement = document.getElementById('session-active-border');
      if (borderElement) {
        borderElement.remove();
      }
      
      const styleElement = document.getElementById('session-border-style');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [status, color, isAISpeaking, isSpeechDetected]);
  
  // This component doesn't render anything visible directly
  return null;
} 