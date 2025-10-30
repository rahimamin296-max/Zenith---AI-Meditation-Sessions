
import React, { useState, useEffect, useRef } from 'react';
import type { MeditationSession } from '../types';

interface MeditationPlayerProps {
  session: MeditationSession;
  onBack: () => void;
}

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8 5v14l11-7z"></path></svg>
);
const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
);

export const MeditationPlayer: React.FC<MeditationPlayerProps> = ({ session, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      sourceRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioContextRef.current) return;

    if (isPlaying) {
      sourceRef.current?.stop();
      setIsPlaying(false);
    } else {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = session.audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
      };
      source.start(0);
      sourceRef.current = source;
      setIsPlaying(true);
    }
  };
  
  const handleBack = () => {
      if(sourceRef.current) {
          sourceRef.current.stop();
      }
      onBack();
  }


  return (
    <div className="relative w-full h-full flex flex-col justify-end bg-black">
      <img src={session.imageUrl} alt="Meditation visual" className="absolute inset-0 w-full h-full object-cover opacity-50 animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

      <div className="relative z-10 p-4 md:p-8 flex flex-col h-full">
        <div className="flex-grow overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(129, 140, 248, 0.5) transparent' }}>
            <h2 className="text-2xl font-bold text-white mb-4">Your Guided Meditation</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{session.script}</p>
        </div>

        <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-500 transition-all duration-300 shadow-lg"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
          </button>
          <button onClick={handleBack} className="px-6 py-3 bg-slate-700/50 text-slate-200 rounded-lg backdrop-blur-sm hover:bg-slate-600/70 transition-colors">
            Create New Session
          </button>
        </div>
      </div>
    </div>
  );
};
