import React from 'react';
import { Agent } from '../../types';
import HologramCard from '../HologramCard';
import { agents, subAgentDetails } from '../../data/agents';

const karimAgent = agents.find(a => a.id === 'karim') as Agent;

const KarimApp: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 gap-6 overflow-y-auto">
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
        <div className="max-w-md w-full mt-4">
            <h2 className="text-xl font-bold font-display text-center mb-3">Core Tools</h2>
            <div className="flex justify-center gap-4 p-4 bg-black/20 rounded-lg border border-white/10">
                {karimAgent.subAgents.map(id => {
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

export default KarimApp;