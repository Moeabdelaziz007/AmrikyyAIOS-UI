import React from 'react';
import { NanoBananaIcon } from '../Icons';

const NanoBananaApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 text-center">
       <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white shadow-2xl">
                <NanoBananaIcon className="w-12 h-12" />
            </div>
            <h1 className="font-display text-3xl font-bold">Nano Banana</h1>
            <p className="text-text-secondary max-w-sm">
                This is the dedicated hub for advanced image generation and editing with Gemini Flash Image.
            </p>
             <p className="text-xs text-text-muted mt-2">
                To generate images, please use the main "AI Image Generator" application.
            </p>
        </div>
    </div>
  );
};

export default NanoBananaApp;