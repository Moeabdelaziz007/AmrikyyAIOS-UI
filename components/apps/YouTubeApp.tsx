import React from 'react';
import { YouTubeIcon } from '../Icons';

const YouTubeApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 text-center">
       <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-2xl">
                <YouTubeIcon className="w-12 h-12" />
            </div>
            <h1 className="font-display text-3xl font-bold">YouTube</h1>
            <p className="text-text-secondary max-w-sm">
               YouTube integration is coming soon. You'll be able to search, view, and interact with videos directly within Amrikyy AI OS.
            </p>
        </div>
    </div>
  );
};

export default YouTubeApp;