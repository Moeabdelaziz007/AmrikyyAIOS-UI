
import React from 'react';
import { Agent } from '../../types';
import HologramCard from '../HologramCard';

const mayaAgent: Agent = {
  name: 'Maya', 
  role: 'Customer Support', 
  icon: '💬', 
  tasks: 51, 
  color: 'from-pink-500 to-rose-400',
  hologram: { color: 'text-primary-pink', glow: '#EC4899', task: 'Resolving booking issue...' }
};

const MayaApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 gap-6">
        <div className="max-w-md w-full">
            <HologramCard agent={mayaAgent} />
        </div>
        <div className="text-center max-w-md">
            <h1 className="font-display text-3xl font-bold">{mayaAgent.name}</h1>
            <p className="text-primary-pink font-semibold">{mayaAgent.role}</p>
            <p className="text-text-secondary mt-2">
                Maya is your friendly and helpful support agent. She can answer your questions, resolve issues with your bookings, and provide assistance whenever you need it.
            </p>
        </div>
    </div>
  );
};

export default MayaApp;