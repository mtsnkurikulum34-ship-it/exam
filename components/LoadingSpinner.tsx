
import React from 'react';
import { SparklesIcon } from './Icons';

export const LoadingSpinner: React.FC = () => (
  <div className="text-center py-12">
    <div className="relative flex justify-center items-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-500"></div>
        <div className="absolute">
            <SparklesIcon className="h-10 w-10 text-indigo-600" />
        </div>
    </div>
    <p className="mt-6 text-lg font-semibold text-slate-700 animate-pulse">Generating your exam package...</p>
    <p className="mt-2 text-sm text-slate-500">This might take a moment. Please wait.</p>
  </div>
);
