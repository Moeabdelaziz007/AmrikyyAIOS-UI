
import React from 'react';
import { Agent } from '../../types';
import HologramCard from '../HologramCard';

const lunaAgent: Agent = {
  name: 'Luna', 
  role: 'Trip Planner', 
  icon: '🌟', 
  tasks: 45, 
  color: 'from-blue-500 to-cyan-400',
  hologram: { color: 'text-primary-cyan', glow: '#06B6D4', task: 'Analyzing Paris flights...' }
};

const LunaApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 gap-6">
        <div className="max-w-md w-full">
            <HologramCard agent={lunaAgent} />
        </div>
        <div className="text-center max-w-md">
            <h1 className="font-display text-3xl font-bold">{lunaAgent.name}</h1>
            <p className="text-primary-cyan font-semibold">{lunaAgent.role}</p>
            <p className="text-text-secondary mt-2">
                Luna is your dedicated trip planning specialist. She analyzes flight routes, finds the best accommodations, and crafts perfect itineraries based on your preferences.
            </p>
        </div>
    </div>
  );
};

export default LunaApp;