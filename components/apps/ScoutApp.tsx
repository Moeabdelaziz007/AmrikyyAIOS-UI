
import React from 'react';
import { Agent } from '../../types';
import HologramCard from '../HologramCard';

const scoutAgent: Agent = {
  name: 'Scout', 
  role: 'Deal Finder', 
  icon: '🔍', 
  tasks: 28, 
  color: 'from-purple-500 to-indigo-400',
  hologram: { color: 'text-primary-purple', glow: '#8B5CF6', task: 'Scanning for Hawaii deals...' }
};

const ScoutApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 gap-6">
        <div className="max-w-md w-full">
            <HologramCard agent={scoutAgent} />
        </div>
        <div className="text-center max-w-md">
            <h1 className="font-display text-3xl font-bold">{scoutAgent.name}</h1>
            <p className="text-primary-purple font-semibold">{scoutAgent.role}</p>
            <p className="text-text-secondary mt-2">
                Scout is your tireless deal hunter. He constantly scans thousands of sources to find the best prices on flights, hotels, and activities, ensuring you never miss a great deal.
            </p>
        </div>
    </div>
  );
};

export default ScoutApp;