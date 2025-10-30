
import React, { useState } from 'react';
import { MeditationCreator } from './components/MeditationCreator';
import { MeditationPlayer } from './components/MeditationPlayer';
import { ChatBot } from './components/ChatBot';
import type { MeditationSession } from './types';
import { generateMeditationScriptAndImagePrompt, generateImage, generateSpeech } from './services/geminiService';
import { decode, decodeAudioData } from './utils/audio';
import { ChatIcon } from './components/icons/ChatIcon';

export default function App() {
  const [session, setSession] = useState<MeditationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleGenerate = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    setSession(null);

    try {
      setLoadingStep('Crafting meditation script');
      const { script, imagePrompt } = await generateMeditationScriptAndImagePrompt(topic);

      setLoadingStep('Creating calming visuals');
      const imageUrl = await generateImage(imagePrompt);

      setLoadingStep('Synthesizing soothing voice');
      const base64Audio = await generateSpeech(script);

      setLoadingStep('Preparing your session');
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decodedBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
      
      setSession({ script, imageUrl, audioBuffer });
      
    } catch (e) {
      const err = e as Error;
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleBackToCreator = () => {
    setSession(null);
  };

  return (
    <main className="bg-slate-900 text-white min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-500">
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.02); opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease forwards;
        }
      `}</style>

      <div className="w-full h-screen flex items-center justify-center">
        {session ? (
          <MeditationPlayer session={session} onBack={handleBackToCreator} />
        ) : (
          <MeditationCreator
            onGenerate={handleGenerate}
            isLoading={isLoading}
            loadingStep={loadingStep}
            error={error}
          />
        )}
      </div>

      {!isChatOpen && (
         <button 
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 bg-violet-600 p-4 rounded-full text-white shadow-lg hover:bg-violet-700 transition-all transform hover:scale-110 z-40"
            aria-label="Open Mindfulness Assistant"
        >
            <ChatIcon />
        </button>
      )}

      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </main>
  );
}
