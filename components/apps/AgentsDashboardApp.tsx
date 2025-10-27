import React from 'react';
import { Agent } from '../../types';
import HologramCard from '../HologramCard';

// FIX: Added the required `subAgents` property to each agent object to match the `Agent` type.
const agents: Agent[] = [
  { 
    name: 'Luna', 
    role: 'Trip Planner', 
    icon: '🌟', 
    tasks: 45, 
    color: 'from-blue-500 to-cyan-400',
    hologram: { color: 'text-primary-cyan', glow: '#06B6D4', task: 'Analyzing Paris flights...' },
    subAgents: ['gemini-pro', 'google-flights', 'google-maps'],
  },
  { 
    name: 'Karim', 
    role: 'Budget Optimizer', 
    icon: '💰', 
    tasks: 32, 
    color: 'from-yellow-500 to-orange-400',
    hologram: { color: 'text-yellow-400', glow: '#FBBF24', task: 'Optimizing Tokyo budget...' },
    subAgents: ['gemini-pro', 'google-search'],
  },
  { 
    name: 'Scout', 
    role: 'Deal Finder', 
    icon: '🔍', 
    tasks: 28, 
    color: 'from-purple-500 to-indigo-400',
    hologram: { color: 'text-primary-purple', glow: '#8B5CF6', task: 'Scanning for Hawaii deals...' },
    subAgents: ['google-search'],
  },
  { 
    name: 'Maya', 
    role: 'Customer Support', 
    icon: '💬', 
    tasks: 51, 
    color: 'from-pink-500 to-rose-400',
    hologram: { color: 'text-primary-pink', glow: '#EC4899', task: 'Resolving booking issue...' },
    subAgents: ['gemini-pro'],
  }
];

const AgentsDashboardApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-bg-tertiary rounded-b-md text-white p-6 overflow-y-auto">
      <h1 id="dashboard-title" className="font-display text-3xl font-bold mb-6">AI Agents Overview</h1>
      
      <h2 className="font-display text-2xl font-bold mb-4">Holographic Workflow Visualization</h2>
      <div role="region" aria-labelledby="dashboard-title" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {agents.map(agent => (
          <HologramCard key={agent.name} agent={agent} />
        ))}
      </div>

      <h2 id="activity-title" className="font-display text-2xl font-bold mb-4">Recent Activity Feed</h2>
      <div role="region" aria-labelledby="activity-title" className="space-y-4 bg-bg-secondary p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 text-green-400" aria-hidden="true">✅</span>
          <p>Luna created a 7-day trip plan to Paris for user #1234.</p>
          <span className="ml-auto text-sm text-text-muted">2 min ago</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-500/20 text-yellow-400" aria-hidden="true">📊</span>
          <p>Karim optimized the budget for a family vacation to Tokyo.</p>
          <span className="ml-auto text-sm text-text-muted">15 min ago</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/20 text-purple-400" aria-hidden="true">🎯</span>
          <p>Scout found 5 new flight deals to Hawaii under $400.</p>
          <span className="ml-auto text-sm text-text-muted">45 min ago</span>
        </div>
         <div className="flex items-center gap-3">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-pink-500/20 text-pink-400" aria-hidden="true">💬</span>
          <p>Maya resolved a booking issue for user #5678.</p>
          <span className="ml-auto text-sm text-text-muted">1 hour ago</span>
        </div>
      </div>
    </div>
  );
};

export default AgentsDashboardApp;