import React from 'react';
import { AppID, WindowInstance, TaskbarTheme } from '../types';
import { AnalyticsHubIcon, CreatorStudioIcon, BrowserIcon, ChatIcon, TripIcon, WorkspaceIcon, WorkflowIcon, SkillForgeIcon, SettingsIcon, AtlasIcon, CortexIcon, OrionIcon } from './Icons';

interface DockProps {
  openWindows: WindowInstance[];
  onOpen: (appId: AppID) => void;
  onRestore: (id: number) => void;
  onFocus: (id: number) => void;
  activeWindowId: number | null;
  onToggleLauncher: () => void;
  taskbarTheme: TaskbarTheme;
}

const appIcons: Record<string, React.FC<{className?: string}>> = {
  analyticsHub: AnalyticsHubIcon,
  creatorStudio: CreatorStudioIcon,
  cognitoBrowser: BrowserIcon,
  chat: ChatIcon,
  travelAgent: TripIcon,
  workspace: WorkspaceIcon,
  workflow: WorkflowIcon,
  skillForge: SkillForgeIcon,
  settings: SettingsIcon,
  atlas: AtlasIcon,
  cortex: CortexIcon,
  orion: OrionIcon,
};


const Dock: React.FC<DockProps> = ({ openWindows, onOpen, onRestore, onFocus, activeWindowId, onToggleLauncher }) => {

  const handleAppClick = (appId: AppID) => {
    const window = openWindows.find(w => w.appId === appId);
    if (window) {
        if(window.isMinimized) {
            onRestore(window.id);
        } else {
            onFocus(window.id);
        }
    } else {
        onOpen(appId);
    }
  };

  const apps: { id: AppID; name: string; }[] = [
      { id: 'analyticsHub', name: 'Analytics Hub' },
      { id: 'creatorStudio', name: 'Creator Studio' },
      { id: 'cognitoBrowser', name: 'Cognito Browser' },
      { id: 'travelAgent', name: 'Travel Agent' },
      { id: 'workflow', name: 'Workflow Studio'},
      { id: 'skillForge', name: 'Skill Forge'},
      { id: 'settings', name: 'Settings' },
  ];

  return (
    <footer className="relative z-20 flex justify-center p-2 animate-slide-up" style={{animationDelay: '400ms'}}>
        <div className="flex items-center gap-2 glass-effect rounded-xl px-3 py-2">
            <button
                onClick={onToggleLauncher}
                className="group relative flex items-center justify-center size-12 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-2xl text-neon-cyan">apps</span>
                <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-black/80 text-white text-xs rounded-md">App Launcher</span>
            </button>
            <div className="w-px h-8 bg-white/10"></div>
            
            {apps.map(app => {
                const Icon = appIcons[app.id];
                const openWindow = openWindows.find(w => w.appId === app.id);
                const isOpen = !!openWindow;
                const isActive = isOpen && !openWindow.isMinimized && openWindow.id === activeWindowId;

                return (
                    <button key={app.id} onClick={() => handleAppClick(app.id)} className="group relative flex items-center justify-center size-12 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        {Icon && <Icon className="text-2xl text-white/90" />}
                        {isActive && <div className="absolute bottom-1 w-4 h-1 bg-neon-cyan rounded-full" />}
                        <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-black/80 text-white text-xs rounded-md">{app.name}</span>
                    </button>
                )
            })}
            
            <div className="w-px h-8 bg-white/10"></div>

            <div className="flex items-center gap-2 pl-2">
                <div className="flex items-center gap-2">
                    <button className="group relative flex items-center justify-center size-10 bg-transparent rounded-lg text-white/70 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl">wifi</span>
                        <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-black/80 text-white text-xs rounded-md">Connected</span>
                    </button>
                    <button className="group relative flex items-center justify-center size-10 bg-transparent rounded-lg text-white/70 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                         <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-black/80 text-white text-xs rounded-md">Notifications</span>
                    </button>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border-2 border-primary/50" style={{backgroundImage: 'url("https://source.unsplash.com/random/100x100/?portrait")'}}></div>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default React.memo(Dock);