
// FIX: Import React to provide types for React.FC.
import React from 'react';

export type AppID = 'chat' | 'trips' | 'terminal' | 'files' | 'settings' | 'image' | 'video' | 'search' | 'maps' | 'luna' | 'karim' | 'scout' | 'maya' | 'workflow' | 'travelPlanViewer';

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
  appProps?: any;
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  sources?: {title: string, uri: string}[];
}

export type SubAgentID = 'gemini-pro' | 'gemini-flash-image' | 'veo' | 'google-search' | 'google-maps' | 'google-flights' | 'youtube';

export interface SubAgent {
    id: SubAgentID;
    name: string;
    icon: React.FC<{className: string}>;
}

export interface Agent {
  name: string;
  role: string;
  icon: string;
  tasks: number;
  color: string;
  hologram: {
    color: string;
    glow: string;
    task: string;
  };
  subAgents: SubAgentID[];
}

export type Theme = 'dark' | 'light';
export type WallpaperID = 'live' | '/wallpaper.svg' | '/wallpaper2.svg' | '/wallpaper3.svg';

export interface Settings {
  theme: Theme;
  wallpaper: WallpaperID | string;
  accentColor: string;
}

export interface SettingsAppProps {
  settings: Settings;
  onSettingsChange: (newSettings: Partial<Settings>) => void;
}
