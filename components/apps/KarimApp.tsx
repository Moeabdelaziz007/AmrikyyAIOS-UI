
import React from 'react';
import { Agent } from '../../types';
import HologramCard from '../HologramCard';

const karimAgent: Agent = {
  name: 'Karim', 
  role: 'Budget Optimizer', 
  icon: '💰', 
  tasks: 32, 
  color: 'from-yellow-500 to-orange-400',
  hologram: { color: 'text-yellow-400', glow: '#FBBF24', task: 'Optimizing Tokyo budget...' }
};

const KarimApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 gap-6">
        <div className="max-w-md w-full">
            <HologramCard agent={karimAgent} />
        </div>
        <div className="text-center max-w-md">
            <h1 className="font-display text-3xl font-bold">{karimAgent.name}</h1>
            <p className="text-yellow-400 font-semibold">{karimAgent.role}</p>
            <p className="text-text-secondary mt-2">
                Karim is your financial expert. He analyzes expenses, optimizes your travel budget, and ensures you get the most value out of every dollar spent on your trip.
            </p>
        </div>
    </div>
  );
};

export default KarimApp;