
import React from 'react';
import { Agent, SubAgentID } from '../../types';
import HologramCard from '../HologramCard';
import { subAgentIcons } from '../Icons';

const lunaAgent: Agent = {
  name: 'Luna', 
  role: 'Trip Planner', 
  icon: '🌟', 
  tasks: 45, 
  color: 'from-blue-500 to-cyan-400',
  hologram: { color: 'text-primary-cyan', glow: '#06B6D4', task: 'Analyzing Paris flights...' },
  subAgents: ['gemini-pro', 'google-flights', 'google-maps'],
};

// FIX: Added missing SubAgentID keys to satisfy the Record type.
const subAgentDetails: Record<SubAgentID, {name: string, icon: React.FC<{className: string}>}> = {
    'gemini-pro': { name: 'Gemini Pro', icon: subAgentIcons['gemini-pro'] },
    'google-flights': { name: 'Google Flights', icon: subAgentIcons['google-flights'] },
    'google-maps': { name: 'Google Maps', icon: subAgentIcons['google-maps'] },
    'gemini-flash-image': { name: 'Nano Banana', icon: subAgentIcons['gemini-flash-image'] },
    'veo': { name: 'Veo', icon: subAgentIcons['veo'] },
    'google-search': { name: 'Google Search', icon: subAgentIcons['google-search'] },
    'youtube': { name: 'YouTube', icon: subAgentIcons['youtube'] },
    'gemini-flash-lite': { name: 'Gemini Flash Lite', icon: subAgentIcons['gemini-flash-lite'] },
    'gemini-tts': { name: 'Gemini TTS', icon: subAgentIcons['gemini-tts'] },
};

const LunaApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 gap-6 overflow-y-auto">
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
        <div className="max-w-md w-full mt-4">
            <h2 className="text-xl font-bold font-display text-center mb-3">Core Tools</h2>
            <div className="flex justify-center gap-4 p-4 bg-black/20 rounded-lg border border-white/10">
                {lunaAgent.subAgents.map(id => {
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

export default LunaApp;