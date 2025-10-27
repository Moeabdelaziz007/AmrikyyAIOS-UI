import React, { useState, useEffect } from 'react';
import { AppID, WindowInstance } from '../types';
// FIX: Import missing icons to satisfy the Record<AppID, ...> type.
import { ChatIcon, TripIcon, TerminalIcon, FileIcon, SettingsIcon, ImageIcon, VideoIcon, SearchIcon, MapIcon, LunaIcon, KarimIcon, ScoutIcon, MayaIcon, WorkflowIcon } from './Icons';

interface TaskbarProps {
  openWindows: WindowInstance[];
  onOpen: (appId: AppID) => void;
  onRestore: (id: number) => void;
  onFocus: (id: number) => void;
  activeWindowId: number | null;
}

// FIX: Add missing icons for 'image', 'video', 'search', 'maps', and 'workflow' to satisfy the Record<AppID, ...> type.
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
  // FIX: Add missing 'travelPlanViewer' icon to satisfy the Record<AppID, ...> type.
  travelPlanViewer: TripIcon,
};

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, onOpen, onRestore, onFocus, activeWindowId }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

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
      { id: 'chat', name: 'Chat' },
      { id: 'workflow', name: 'Workflow'},
      { id: 'luna', name: 'Luna' },
      { id: 'karim', name: 'Karim' },
      { id: 'scout', name: 'Scout' },
      { id: 'maya', name: 'Maya' },
      { id: 'trips', name: 'Trips' },
      { id: 'terminal', name: 'Terminal' },
  ];

  return (
    <div
      role="navigation"
      aria-label="Main taskbar"
      className="absolute bottom-0 left-0 right-0 h-14 bg-bg-secondary/70 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-4"
    >
      <div className="flex items-center space-x-2">
         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-blue to-primary-purple flex items-center justify-center font-bold text-lg font-display" aria-label="Start Menu">
            A
         </div>

        {apps.map(app => {
            const Icon = appIcons[app.id];
            const openWindow = openWindows.find(w => w.appId === app.id);
            const isOpen = !!openWindow;
            const isActive = isOpen && !openWindow.isMinimized && openWindow.id === activeWindowId;

            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className={`relative h-10 w-10 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors duration-200 ${isOpen ? 'bg-white/5' : ''}`}
                aria-label={app.name}
                title={app.name}
              >
                <Icon className="h-6 w-6 text-text-secondary" />
                {isOpen && <div className="absolute bottom-0 h-1 w-4 bg-primary-blue rounded-full" />}
                {isActive && <span className="sr-only">(Active Window)</span>}
              </button>
            )
        })}
      </div>

      <div className="flex items-center space-x-2">
        <div className="text-right text-xs">
          <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-text-muted">{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;