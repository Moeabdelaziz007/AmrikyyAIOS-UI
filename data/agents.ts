import { Agent, SubAgent, SubAgentID } from '../types';
import { subAgentIcons } from '../components/Icons';

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
    role: 'AI Coding Agent', 
    icon: '💻', 
    tasks: 18, 
    color: 'from-green-500 to-emerald-400',
    hologram: { 
        color: 'text-green-400', 
        glow: '#34D399', 
        task: 'Refactoring React component...',
        aberrationColors: ['#34D399', '#06B6D4']
    },
    subAgents: ['gemini-pro'],
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
};