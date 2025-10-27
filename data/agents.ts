import { Agent, SubAgent, SubAgentID, AgentID } from '../types';
import { subAgentIcons, CortexIcon } from '../components/Icons';

export const agents: Agent[] = [
  { 
    id: 'luna',
    name: 'Luna', 
    role: 'Trip Planner', 
    icon: '🌟', 
    tasks: 45, 
    color: 'from-blue-500 to-cyan-400',
    hologram: { 
        color: 'text-primary-cyan', 
        glow: '#06B6D4', 
        task: 'Analyzing Paris flights...',
        aberrationColors: ['#06B6D4', '#8B5CF6']
    },
    subAgents: ['gemini-pro', 'google-flights', 'google-maps'],
  },
  { 
    id: 'karim',
    name: 'Karim', 
    role: 'Budget Optimizer', 
    icon: '💰', 
    tasks: 32, 
    color: 'from-yellow-500 to-orange-400',
    hologram: { 
        color: 'text-yellow-400', 
        glow: '#FBBF24', 
        task: 'Optimizing Tokyo budget...',
        aberrationColors: ['#FBBF24', '#EF4444']
    },
    subAgents: ['gemini-pro', 'google-search'],
  },
  { 
    id: 'scout',
    name: 'Scout', 
    role: 'Deal Finder', 
    icon: '🔍', 
    tasks: 28, 
    color: 'from-purple-500 to-indigo-400',
    hologram: { 
        color: 'text-primary-purple', 
        glow: '#8B5CF6', 
        task: 'Scanning for Hawaii deals...',
        aberrationColors: ['#8B5CF6', '#EC4899']
    },
    subAgents: ['google-search'],
  },
  { 
    id: 'maya',
    name: 'Maya', 
    role: 'Customer Support', 
    icon: '💬', 
    tasks: 51, 
    color: 'from-pink-500 to-rose-400',
    hologram: { 
        color: 'text-primary-pink', 
        glow: '#EC4899', 
        task: 'Resolving booking issue...',
        aberrationColors: ['#EC4899', '#8B5CF6']
    },
    subAgents: ['gemini-pro'],
  },
  {
    id: 'jules',
    name: 'Jules', 
    role: 'System Debug & Self-Healing Agent', 
    icon: '⚙️', 
    tasks: 18, 
    color: 'from-green-500 to-emerald-400',
    hologram: { 
        color: 'text-green-400', 
        glow: '#34D399', 
        task: 'Running system diagnostics...',
        aberrationColors: ['#34D399', '#06B6D4']
    },
    subAgents: ['gemini-pro'],
  },
  {
    id: 'cortex',
    name: 'Cortex',
    role: 'Collaborative Ideation Agent',
    icon: '💡',
    tasks: 12,
    color: 'from-orange-500 to-amber-400',
    hologram: {
        color: 'text-orange-400',
        glow: '#FB923C',
        task: 'Synthesizing team ideas...',
        aberrationColors: ['#FB923C', '#06B6D4']
    },
    subAgents: ['gemini-pro', 'youtube'],
  },
  {
    id: 'orion',
    name: 'Orion',
    role: 'Master Control Agent',
    icon: '🌐',
    tasks: 99,
    color: 'from-gray-200 to-slate-400',
    hologram: {
        color: 'text-white',
        glow: '#FFFFFF',
        task: 'Orchestrating A2A Communication Bus...',
        aberrationColors: ['#3B82F6', '#EC4899']
    },
    subAgents: ['gemini-pro', 'gemini-flash-image', 'veo', 'google-search', 'google-maps', 'google-flights', 'youtube', 'gemini-flash-lite', 'gemini-tts', 'gemini-music'],
  }
];

export const subAgentDetails: Record<SubAgentID, SubAgent> = {
    'gemini-pro': { id: 'gemini-pro', name: 'Gemini Pro', description: 'Advanced reasoning and text generation.', icon: subAgentIcons['gemini-pro'] },
    'gemini-flash-image': { id: 'gemini-flash-image', name: 'Nano Banana', description: 'Image generation and editing.', icon: subAgentIcons['gemini-flash-image'] },
    'veo': { id: 'veo', name: 'Veo', description: 'High-quality video generation.', icon: subAgentIcons['veo'] },
    'google-search': { id: 'google-search', name: 'Google Search', description: 'Real-time web search grounding.', icon: subAgentIcons['google-search'] },
    'google-maps': { id: 'google-maps', name: 'Google Maps', description: 'Location and place information.', icon: subAgentIcons['google-maps'] },
    'google-flights': { id: 'google-flights', name: 'Google Flights', description: 'Flight data and price analysis.', icon: subAgentIcons['google-flights'] },
    'youtube': { id: 'youtube', name: 'YouTube', description: 'Video platform integration.', icon: subAgentIcons['youtube'] },
    'gemini-flash-lite': { id: 'gemini-flash-lite', name: 'Gemini Flash Lite', description: 'Low-latency text generation.', icon: subAgentIcons['gemini-flash-lite'] },
    'gemini-tts': { id: 'gemini-tts', name: 'Gemini TTS', description: 'Text-to-speech conversion.', icon: subAgentIcons['gemini-tts'] },
    'gemini-music': { id: 'gemini-music', name: 'Gemini Music', description: 'AI music generation.', icon: subAgentIcons['gemini-tts'] },
};
