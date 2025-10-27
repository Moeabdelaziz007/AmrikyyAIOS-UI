import React from 'react';
import { AppID, WindowInstance, TaskbarTheme } from '../types';
import { ChatIcon, GridIcon, FileIcon, SettingsIcon, WorkflowIcon, JulesIcon, VoiceAssistantIcon, SparklesIcon, SmartWatchIcon, WorkspaceIcon, EventLogIcon } from './Icons';

interface DockProps {
  openWindows: WindowInstance[];
  onOpen: (appId: AppID) => void;
  onRestore: (id: number) => void;
  onFocus: (id: number) => void;
  activeWindowId: number | null;
  onToggleLauncher: () => void;
  taskbarTheme: TaskbarTheme;
}

const TravelAgentIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const MarketingIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
);


const appIcons: Record<string, React.FC<{className: string}>> = {
  chat: ChatIcon,
  voice: VoiceAssistantIcon,
  workflow: WorkflowIcon,
  travelAgent: TravelAgentIcon,
  marketing: MarketingIcon,
  files: FileIcon,
  settings: SettingsIcon,
  jules: JulesIcon,
  smartwatch: SmartWatchIcon,
  workspace: WorkspaceIcon,
  terminal: JulesIcon,
  luna: SparklesIcon,
  karim: SparklesIcon,
  scout: SparklesIcon,
  maya: SparklesIcon,
  travelPlanViewer: TravelAgentIcon,
  eventLog: EventLogIcon,
};

const Dock: React.FC<DockProps> = ({ openWindows, onOpen, onRestore, onFocus, activeWindowId, onToggleLauncher, taskbarTheme }) => {

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
      { id: 'chat', name: 'AI Chat' },
      { id: 'voice', name: 'Voice Assistant' },
      { id: 'travelAgent', name: 'Travel Agent' },
      { id: 'workspace', name: 'Workspace' },
      { id: 'workflow', name: 'Workflow Studio'},
      { id: 'eventLog', name: 'Event Log'},
      { id: 'smartwatch', name: 'Smart Watch' },
      { id: 'settings', name: 'Settings' },
  ];

  const themeClasses = {
      glass: 'bg-dock-bg backdrop-blur-lg border-border-color',
      solid: 'bg-bg-tertiary border-border-color',
      transparent: 'bg-transparent border-transparent',
  }

  return (
    <div
      role="navigation"
      aria-label="Application Dock"
      className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2"
    >
      <div className={`flex items-end justify-center space-x-1 sm:space-x-2 h-16 sm:h-20 p-1 sm:p-2 rounded-xl sm:rounded-2xl border shadow-2xl transition-colors duration-300 ${themeClasses[taskbarTheme]}`}>
        <button
          onClick={onToggleLauncher}
          className="group relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-200 ease-out hover:scale-125"
          aria-label="App Launcher"
          title="App Launcher"
        >
          <GridIcon className="h-6 w-6 sm:h-7 sm:w-7 text-text-secondary group-hover:text-text-primary" />
        </button>

        <div className="h-full w-px bg-border-color/50 mx-1"></div>

        {apps.map(app => {
            const Icon = appIcons[app.id];
            const openWindow = openWindows.find(w => w.appId === app.id);
            const isOpen = !!openWindow;
            const isActive = isOpen && !openWindow.isMinimized && openWindow.id === activeWindowId;

            return (
              <div key={app.id} className="relative flex flex-col items-center justify-end h-full">
                <button
                  onClick={() => handleAppClick(app.id)}
                  className="group relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-200 ease-out hover:scale-125"
                  aria-label={app.name}
                  title={app.name}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-text-secondary group-hover:text-text-primary" />
                   {isActive && <span className="sr-only">(Active Window)</span>}
                </button>
                 {isOpen && <div className={`mt-1 sm:mt-1.5 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-text-muted'}`} />}
              </div>
            )
        })}
      </div>
    </div>
  );
};

export default React.memo(Dock);
