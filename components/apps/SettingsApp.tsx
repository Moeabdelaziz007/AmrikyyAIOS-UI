import React from 'react';
import { SettingsIcon } from '../Icons';

const SettingsApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6">
       <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-500 to-slate-500 flex items-center justify-center text-white shadow-2xl">
                <SettingsIcon className="w-12 h-12 animate-spin" style={{animationDuration: '10s'}} />
            </div>
            <h1 className="font-display text-3xl font-bold">System Settings</h1>
            <p className="text-text-secondary max-w-sm">
                Configuration options for Amrikyy AI OS are coming soon. You'll be able to customize your desktop, manage AI agents, and set your preferences.
            </p>
        </div>
    </div>
  );
};

export default SettingsApp;
