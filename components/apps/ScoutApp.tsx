
import React from 'react';
import { Agent, SubAgentID } from '../../types';
import HologramCard from '../HologramCard';
import { subAgentIcons } from '../Icons';

const scoutAgent: Agent = {
  name: 'Scout', 
  role: 'Deal Finder', 
  icon: '🔍', 
  tasks: 28, 
  color: 'from-purple-500 to-indigo-400',
  hologram: { color: 'text-primary-purple', glow: '#8B5CF6', task: 'Scanning for Hawaii deals...' },
  subAgents: ['google-search'],
};

const subAgentDetails: Record<SubAgentID, {name: string, icon: React.FC<{className: string}>}> = {
    'google-search': { name: 'Google Search', icon: subAgentIcons['google-search'] },
    'gemini-pro': { name: 'Gemini Pro', icon: subAgentIcons['gemini-pro'] },
    'gemini-flash-image': { name: 'Nano Banana', icon: subAgentIcons['gemini-flash-image'] },
    'veo': { name: 'Veo', icon: subAgentIcons['veo'] },
    'google-maps': { name: 'Google Maps', icon: subAgentIcons['google-maps'] },
    'google-flights': { name: 'Google Flights', icon: subAgentIcons['google-flights'] },
    'youtube': { name: 'YouTube', icon: subAgentIcons['youtube'] },
};

const ScoutApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 gap-6 overflow-y-auto">
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
        <div className="max-w-md w-full mt-4">
            <h2 className="text-xl font-bold font-display text-center mb-3">Core Tools</h2>
            <div className="flex justify-center gap-4 p-4 bg-black/20 rounded-lg border border-white/10">
                {scoutAgent.subAgents.map(id => {
                    const subAgent = subAgentDetails[id];
                    const Icon = subAgent.icon;
                    return (
                        <div key={id} title={subAgent.name} className="flex flex-col items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                            <Icon className="w-10 h-10" />
                            <span className="text-xs">{subAgent.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default ScoutApp;