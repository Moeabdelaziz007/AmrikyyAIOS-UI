
import React from 'react';
import { Agent, SubAgentID } from '../../types';
import HologramCard from '../HologramCard';
import { subAgentIcons } from '../Icons';

const julesAgent: Agent = {
  name: 'Jules', 
  role: 'AI Coding Agent', 
  icon: '💻', 
  tasks: 18, 
  color: 'from-green-500 to-emerald-400',
  hologram: { color: 'text-green-400', glow: '#34D399', task: 'Refactoring React component...' },
  subAgents: ['gemini-pro'],
};

const subAgentDetails: Record<SubAgentID, {name: string, icon: React.FC<{className: string}>}> = {
    'gemini-pro': { name: 'Gemini Pro', icon: subAgentIcons['gemini-pro'] },
    'google-search': { name: 'Google Search', icon: subAgentIcons['google-search'] },
    'gemini-flash-image': { name: 'Nano Banana', icon: subAgentIcons['gemini-flash-image'] },
    'veo': { name: 'Veo', icon: subAgentIcons['veo'] },
    'google-maps': { name: 'Google Maps', icon: subAgentIcons['google-maps'] },
    'google-flights': { name: 'Google Flights', icon: subAgentIcons['google-flights'] },
    'youtube': { name: 'YouTube', icon: subAgentIcons['youtube'] },
    'gemini-flash-lite': { name: 'Gemini Flash Lite', icon: subAgentIcons['gemini-flash-lite'] },
    'gemini-tts': { name: 'Gemini TTS', icon: subAgentIcons['gemini-tts'] },
};

const JulesApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 gap-6 overflow-y-auto">
        <div className="max-w-md w-full">
            <HologramCard agent={julesAgent} />
        </div>
        <div className="text-center max-w-md">
            <h1 className="font-display text-3xl font-bold">{julesAgent.name}</h1>
            <p className="text-green-400 font-semibold">{julesAgent.role}</p>
            <p className="text-text-secondary mt-2">
                Jules is your expert coding assistant. He can write code, debug issues, explain complex algorithms, and help you build amazing software faster.
            </p>
        </div>
        <div className="max-w-md w-full mt-4">
            <h2 className="text-xl font-bold font-display text-center mb-3">Core Tools</h2>
            <div className="flex justify-center gap-4 p-4 bg-black/20 rounded-lg border border-white/10">
                {julesAgent.subAgents.map(id => {
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

export default JulesApp;
