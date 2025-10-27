
export type AppID = 'chat' | 'agents' | 'trips' | 'terminal' | 'files' | 'settings' | 'image' | 'video' | 'search' | 'maps';

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
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  sources?: {title: string, uri: string}[];
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
  }
}