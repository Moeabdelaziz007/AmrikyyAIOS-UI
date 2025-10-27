import React from 'react';

// A "Skill" is a discrete capability the AI system can have.
export type SkillID =
  'gemini-pro-text' | 'image-generation' | 'video-generation' | 'web-search' |
  'maps-search' | 'flight-search' | 'youtube-search' | 'fast-text' | 'text-to-speech' | 'music-generation';

export type SkillCategory = 'Language' | 'Vision' | 'Audio' | 'Logic' | 'Knowledge';

export interface Skill {
  id: SkillID;
  name: string;
  description: string;
  category: SkillCategory;
  icon: React.FC<{className: string}>;
}


// Fix: Add all new application IDs to the AppID type to resolve compilation errors.
// FIX: Added 'atlas', 'cortex', and 'orion' to AppID to allow them to be used as applications. This resolves an error in DesktopAppsGrid.tsx.
export type AppID = 
  'chat' | 'terminal' | 'files' | 'settings' | 
  'luna' | 'karim' | 'scout' | 'maya' | 'jules' | 'atlas' | 'cortex' | 'orion' |
  'voice' | 'workflow' | 'travelAgent' | 'marketing' | 'travelPlanViewer' |
  'search' | 'maps' | 'transcriber' | 'videoAnalyzer' | 'image' | 'video' |
  'veo' | 'nanoBanana' | 'youtube' | 'gmail' | 'smartwatch' | 'workspace' | 'eventLog' |
  'skillForge' | 'chronoVault' | 'creatorStudio' | 'cognitoBrowser' | 'analyticsHub';

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
  sender: 'user' | 'ai' | 'system';
  text: string;
  sources?: {title: string, uri: string}[];
}

export type AgentID = 'luna' | 'karim' | 'scout' | 'maya' | 'jules' | 'orion' | 'cortex' | 'atlas';
export interface Agent {
  id: AgentID;
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
  skillIDs: SkillID[]; // Agents are now defined by the skills they possess.
}

// FIX: Added missing SubAgent interface to resolve compilation error in SubAgentNode.tsx.
export interface SubAgent {
  name: string;
  icon: React.FC<{className: string}>;
}

export type Theme = 'dark' | 'light' | 'neon-noir' | 'synthwave-sunset';
export type WallpaperID = '/wallpaper.svg' | '/wallpaper2.svg' | '/wallpaper3.svg';
export type TaskbarTheme = 'glass' | 'solid' | 'transparent';
export type WindowStyle = 'gemini' | 'macos' | 'futuristic' | 'cyberpunk';


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
    agentId: AgentID;
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

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export interface Automation {
  id: string;
  trigger: string;
  action: {
    appId: AppID;
    task: string;
  };
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Workspace {
  id: string;
  title: string;
  contentType: 'youtube' | 'notes';
  contentUrl?: string;
  notes?: string;
  members: User[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'Active' | 'Paused' | 'Completed';
    earnings: number;
}

export interface SystemEntity {
  id: AppID | AgentID;
  name: string;
  icon: string;
  goal: string;
  description: string;
  workflow: {
    icon: string;
    label: string;
  }[];
}