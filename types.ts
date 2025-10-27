import React from 'react';

export type AppID = 
  'chat' | 'terminal' | 'files' | 'settings' | 
  'luna' | 'karim' | 'scout' | 'maya' | 'jules' | 
  'voice' | 'workflow' | 'travelAgent' | 'marketing' | 'travelPlanViewer';

export interface TravelPlan {
  destination: string;
  tripTitle: string;
  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];
  budget: {
    category: string;
    cost: number;
  }[];
  dealsAndLinks: {
    title: string;
    url: string;
  }[];
}

export interface WindowInstance {
  id: number;
  appId: AppID;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  appProps: any;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: {title: string, uri: string}[];
}

export type SubAgentID = 
  'gemini-pro' | 'gemini-flash-image' | 'veo' | 'google-search' | 'google-maps' | 
  'google-flights' | 'youtube' | 'gemini-flash-lite' | 'gemini-tts' | 'gemini-music';

export interface SubAgent {
    id: SubAgentID;
    name: string;
    description: string;
    icon: React.FC<{className: string}>;
}

export interface Agent {
  id: 'luna' | 'karim' | 'scout' | 'maya' | 'jules' | 'orion';
  name: string;
  role: string;
  icon: string;
  tasks: number;
  color: string;
  hologram: {
    color: string;
    glow: string;
    task: string;
    aberrationColors: [string, string];
  };
  subAgents: SubAgentID[];
}

export type Theme = 'dark' | 'light' | 'neon-noir' | 'synthwave-sunset';
export type WallpaperID = '/wallpaper.svg' | '/wallpaper2.svg' | '/wallpaper3.svg';
export type TaskbarTheme = 'glass' | 'solid' | 'transparent';
export type WindowStyle = 'gemini' | 'macos' | 'futuristic';


export interface Settings {
  theme: Theme;
  wallpaper: WallpaperID | string;
  accentColor: string;
  taskbarTheme: TaskbarTheme;
  windowStyle: WindowStyle;
}

export interface SettingsAppProps {
  settings: Settings;
  onSettingsChange: (newSettings: Partial<Settings>) => void;
}

export interface TrendingItem {
  rank: number;
  name: string;
  category: 'Tool' | 'Model' | 'News';
  change: number;
}

export interface WorkflowNode {
    id: string;
    agentId: Agent['id'];
    description: string;
}

export interface WorkflowConnection {
    from: string;
    to: string;
}

export interface Workflow {
    title: string;
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
}