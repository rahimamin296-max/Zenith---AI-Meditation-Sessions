
import React, { useState } from 'react';
import { WandIcon } from './icons/WandIcon';
import { LoadingIndicator } from './LoadingIndicator';

interface MeditationCreatorProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
  loadingStep: string;
  error: string | null;
}

export const MeditationCreator: React.FC<MeditationCreatorProps> = ({ onGenerate, isLoading, loadingStep, error }) => {
  const [topic, setTopic] = useState('');

  const suggestions = ["Reduce Anxiety", "Morning Energy", "Deep Sleep", "Find Focus", "Gratitude"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    onGenerate(suggestion);
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-4 md:p-8">
      {isLoading ? (
        <LoadingIndicator step={loadingStep} />
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Zenith Meditation
            </h1>
            <p className="text-slate-300 mt-2 text-lg">
              Craft a personal moment of peace. What would you like to focus on?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'Letting go of stress'"
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-900/50"
            >
              <WandIcon className="w-5 h-5" />
              Generate Session
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-slate-400 mb-4">Or try one of these:</p>
             <div className="flex flex-wrap gap-3 justify-center">
                {suggestions.map(s => (
                    <button key={s} onClick={() => handleSuggestionClick(s)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 hover:text-white transition-colors duration-200">
                        {s}
                    </button>
                ))}
             </div>
          </div>
          
          {error && <p className="mt-6 text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </>
      )}
    </div>
  );
};
