import React from 'react';
import { GmailIcon } from '../Icons';

const GmailApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 text-center">
       <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center text-white shadow-2xl">
                <GmailIcon className="w-12 h-12" />
            </div>
            <h1 className="font-display text-3xl font-bold">Gmail</h1>
            <p className="text-text-secondary max-w-sm">
               Gmail integration is under development. Soon, you'll manage your emails with the power of AI, right from your desktop.
            </p>
        </div>
    </div>
  );
};

export default GmailApp;