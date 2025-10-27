import React from 'react';
import { AppID, WindowInstance, TaskbarTheme } from '../types';
// FIX: Add missing agent icons
import { ChatIcon, TripIcon, TerminalIcon, GridIcon, FileIcon, SettingsIcon, ImageIcon, VideoIcon, SearchIcon, MapIcon, LunaIcon, KarimIcon, ScoutIcon, MayaIcon, WorkflowIcon, MicrophoneIcon, VideoAnalyzeIcon, JulesIcon, VoiceAssistantIcon, VeoIcon, NanoBananaIcon, YouTubeIcon, GmailIcon } from './Icons';

interface DockProps {
  openWindows: WindowInstance[];
  onOpen: (appId: AppID) => void;
  onRestore: (id: number) => void;
  onFocus: (id: number) => void;
  activeWindowId: number | null;
  onToggleLauncher: () => void;
  taskbarTheme: TaskbarTheme;
}

const appIcons: Record<AppID, React.FC<{className: string}>> = {
  chat: ChatIcon,
  trips: TripIcon,
  terminal: TerminalIcon,
  files: FileIcon,
  settings: SettingsIcon,
  image: ImageIcon,
  video: VideoIcon,
  search: SearchIcon,
  maps: MapIcon,
  luna: LunaIcon,
  karim: KarimIcon,
  scout: ScoutIcon,
  maya: MayaIcon,
  workflow: WorkflowIcon,
  travelPlanViewer: TripIcon,
  transcriber: MicrophoneIcon,
  videoAnalyzer: VideoAnalyzeIcon,
  jules: JulesIcon,
  voice: VoiceAssistantIcon,
  veo: VeoIcon,
  nanoBanana: NanoBananaIcon,
  youtube: YouTubeIcon,
  // FIX: Use GmailIcon instead of GmailApp component
  gmail: GmailIcon,
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
      { id: 'workflow', name: 'Workflow Studio'},
      { id: 'search', name: 'AI Search' },
      { id: 'veo', name: 'Veo' },
      { id: 'nanoBanana', name: 'Nano Banana' },
      { id: 'youtube', name: 'YouTube' },
      { id: 'gmail', name: 'Gmail' },
      { id: 'files', name: 'Files' },
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
      className="fixed bottom-4 left-1/2 -translate-x-1/2"
    >
      <div className={`flex items-end justify-center space-x-2 h-20 p-2 rounded-2xl border shadow-2xl transition-colors duration-300 ${themeClasses[taskbarTheme]}`}>
        <button
          onClick={onToggleLauncher}
          className="group relative h-14 w-14 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all duration-200 ease-out hover:scale-125"
          aria-label="App Launcher"
          title="App Launcher"
        >
          <GridIcon className="h-7 w-7 text-text-secondary group-hover:text-text-primary" />
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
                  className="group relative h-14 w-14 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all duration-200 ease-out hover:scale-125"
                  aria-label={app.name}
                  title={app.name}
                >
                  <Icon className="h-7 w-7 text-text-secondary group-hover:text-text-primary" />
                   {isActive && <span className="sr-only">(Active Window)</span>}
                </button>
                 {isOpen && <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-text-muted'}`} />}
              </div>
            )
        })}
      </div>
    </div>
  );
};

export default React.memo(Dock);