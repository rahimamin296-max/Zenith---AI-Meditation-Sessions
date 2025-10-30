
import React from 'react';

interface LoadingIndicatorProps {
  step: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
      <p className="mt-4 text-lg font-medium text-slate-300">Generating Your Session</p>
      <p className="text-slate-400">{step}...</p>
    </div>
  );
};
