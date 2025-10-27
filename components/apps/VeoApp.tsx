import React from 'react';
import { VeoIcon } from '../Icons';

const VeoApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 text-center">
       <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-2xl">
                <VeoIcon className="w-12 h-12" />
            </div>
            <h1 className="font-display text-3xl font-bold">Veo Video Generation</h1>
            <p className="text-text-secondary max-w-sm">
                This is the dedicated hub for high-quality video generation powered by Google's Veo model.
            </p>
            <p className="text-xs text-text-muted mt-2">
                To generate videos, please use the main "AI Video Generator" application.
            </p>
        </div>
    </div>
  );
};

export default VeoApp;