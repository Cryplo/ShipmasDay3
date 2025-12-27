'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Snow } from '@/components/Snow';
import { House } from '@/components/House';
import { Sparkles } from '@/components/Sparkles';
import { VolumeMeter } from '@/components/VolumeMeter';
import { useAudioInput } from '@/hooks/useAudioInput';

const TOTAL_LIGHTS = 40;
const LIGHTS_PER_SECOND = 4;
const INTERVAL_MS = 1000 / LIGHTS_PER_SECOND; // 250ms per light

type Screen = 'intro' | 'game' | 'results';

interface LightState {
  isOn: boolean;
  color: string;
}

function volumeToColor(volume: number): string {
  // Map volume to hue: 0 (quiet) = green (120), 1 (loud) = red (0)
  // Intermediate values produce yellow/orange
  const hue = 120 - (volume * 120);
  return `hsl(${hue}, 85%, 55%)`;
}

export default function Home() {
  const [audioState, audioControls] = useAudioInput();
  const [screen, setScreen] = useState<Screen>('intro');
  const [lights, setLights] = useState<LightState[]>(
    Array(TOTAL_LIGHTS).fill(null).map(() => ({ isOn: false, color: '#333' }))
  );
  const [isSequenceRunning, setIsSequenceRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const volumeRef = useRef(0);
  const lightIndexRef = useRef(0);

  // Keep volume ref updated
  useEffect(() => {
    volumeRef.current = audioState.volume;
  }, [audioState.volume]);

  const resetSequence = useCallback(() => {
    setLights(Array(TOTAL_LIGHTS).fill(null).map(() => ({ isOn: false, color: '#333' })));
    lightIndexRef.current = 0;
    setIsSequenceRunning(false);
  }, []);

  const startSequence = useCallback(async () => {
    // Reset state
    resetSequence();
    setScreen('game');

    // Start audio if not already listening
    if (!audioState.isListening) {
      await audioControls.startListening();
    }

    // Small delay to ensure audio is set up
    await new Promise(resolve => setTimeout(resolve, 100));

    setIsSequenceRunning(true);
    lightIndexRef.current = 0;

    intervalRef.current = setInterval(() => {
      const currentIndex = lightIndexRef.current;
      
      if (currentIndex >= TOTAL_LIGHTS) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsSequenceRunning(false);
        setScreen('results');
        return;
      }

      const currentVolume = volumeRef.current;
      const color = volumeToColor(currentVolume);

      setLights(prev => {
        const newLights = [...prev];
        newLights[currentIndex] = { isOn: true, color };
        return newLights;
      });

      lightIndexRef.current = currentIndex + 1;
    }, INTERVAL_MS);
  }, [audioState.isListening, audioControls, resetSequence]);

  const stopSequence = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    audioControls.stopListening();
    setIsSequenceRunning(false);
  }, [audioControls]);

  const goToIntro = useCallback(() => {
    stopSequence();
    resetSequence();
    setScreen('intro');
  }, [stopSequence, resetSequence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const litLightsCount = lights.filter(l => l.isOn).length;
  const progress = (litLightsCount / TOTAL_LIGHTS) * 100;

  // Intro Screen
  if (screen === 'intro') {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Snow count={150} />

        
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 font-christmas">
              Light Symphony
            </h1>
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
              Paint a house with lights using your voice! Make sounds to color each light - 
              quiet sounds create green, loud sounds create red.
            </p>
            
            <div className="panel mb-6">
              <h2 className="font-medium mb-3">How it works</h2>
              <ul className="text-sm text-[var(--text-secondary)] space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--success)]">1.</span>
                  <span>Allow microphone access when prompted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--success)]">2.</span>
                  <span>Sing, hum, clap, or make noise as each light turns on</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--success)]">3.</span>
                  <span>Watch your unique sound painting come to life!</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startSequence}
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Painting
            </button>
            
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              40 lights &middot; 10 seconds &middot; Endless possibilities
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Results Screen
  if (screen === 'results') {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Snow count={150} />

        
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 font-christmas">
              Your Sound Painting
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              You lit up all {TOTAL_LIGHTS} lights!
            </p>
            
            {/* Smaller house display */}
            <div className="flex justify-center mb-6" style={{ height: '320px' }}>
              <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center' }}>
                <House lights={lights} celebrationActive={true} />
                <Sparkles active={true} />
              </div>
            </div>
            
            <div className="panel w-full max-w-sm mx-auto">
              <div className="flex flex-col gap-3">
                <button
                  onClick={startSequence}
                  className="btn btn-primary w-full"
                >
                  Play Again
                </button>
                
                <button
                  onClick={goToIntro}
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  Back to Start
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Game Screen
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Snowy background */}
      <Snow count={150} />

      {/* Ground snow */}
      <div className="ground-snow" />

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title */}
        <header className="text-center mb-4">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight font-christmas">
            Light Symphony
          </h1>
        </header>

        {/* House with lights */}
        <div className="relative">
          <House lights={lights} celebrationActive={false} />
          <Sparkles active={false} />
        </div>

        {/* Controls panel */}
        <div className="panel mt-4 flex flex-col items-center gap-3 w-full max-w-sm">
          {/* Error message */}
          {audioState.error && (
            <div className="w-full p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-sm text-center">
              {audioState.error}
            </div>
          )}

          {/* Volume meter */}
          {audioState.isListening && (
            <VolumeMeter volume={audioState.volume} isActive={true} />
          )}

          {/* Progress indicator */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2 font-christmas">
              <span>Progress</span>
              <span>{litLightsCount}/{TOTAL_LIGHTS}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full">
            {isSequenceRunning && (
              <button
                onClick={stopSequence}
                className="btn btn-danger flex-1"
              >
                Stop
              </button>
            )}

            {!isSequenceRunning && (
              <>
                <button
                  onClick={startSequence}
                  className="btn btn-primary flex-1"
                >
                  Restart
                </button>
                <button
                  onClick={goToIntro}
                  className="btn btn-secondary flex-1"
                >
                  Back
                </button>
              </>
            )}
          </div>

          {/* Microphone indicator */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-christmas">
            <span
              className={`status-dot ${
                audioState.isListening ? 'active' : audioState.permissionDenied ? 'blocked' : 'inactive'
              }`}
            />
            <span>
              {audioState.isListening
                ? 'Microphone active'
                : audioState.permissionDenied
                  ? 'Microphone blocked'
                  : 'Microphone inactive'}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
