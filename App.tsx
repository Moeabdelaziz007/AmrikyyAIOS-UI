
import React, { useState, useCallback } from 'react';
import { WindowInstance, AppID } from './types';
import Window from './components/Window';
import Dock from './components/Dock';
import ChatApp from './components/apps/ChatApp';
import TripPlannerApp from './components/apps/TripPlannerApp';
import TerminalApp from './components/apps/TerminalApp';
import FilesApp from './components/apps/FilesApp';
import SettingsApp from './components/apps/SettingsApp';
import ImageGeneratorApp from './components/apps/ImageGeneratorApp';
import VideoGeneratorApp from './components/apps/VideoGeneratorApp';
import SearchApp from './components/apps/SearchApp';
import MapsApp from './components/apps/MapsApp';
import AIOrb from './components/AIOrb';
import AnimatedBackground from './components/AnimatedBackground';
import DesktopAppsGrid from './components/DesktopAppsGrid';
import LunaApp from './components/apps/LunaApp';
import KarimApp from './components/apps/KarimApp';
import ScoutApp from './components/apps/ScoutApp';
import MayaApp from './components/apps/MayaApp';

const appComponents: Record<AppID, React.FC> = {
  chat: ChatApp,
  trips: TripPlannerApp,
  terminal: TerminalApp,
  files: FilesApp,
  settings: SettingsApp,
  image: ImageGeneratorApp,
  video: VideoGeneratorApp,
  search: SearchApp,
  maps: MapsApp,
  luna: LunaApp,
  karim: KarimApp,
  scout: ScoutApp,
  maya: MayaApp,
};

const appTitles: Record<AppID, string> = {
  chat: 'Amrikyy AI Chat',
  trips: 'Trip Planner',
  terminal: 'Terminal',
  files: 'File Explorer',
  settings: 'System Settings',
  image: 'AI Image Generator',
  video: 'AI Video Generator',
  search: 'AI Search',
  maps: 'AI Maps',
  luna: 'Agent: Luna',
  karim: 'Agent: Karim',
  scout: 'Agent: Scout',
  maya: 'Agent: Maya',
};

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [nextId, setNextId] = useState(1);

  const openWindow = useCallback((appId: AppID) => {
    setWindows(prevWindows => {
      const existingWindow = prevWindows.find(w => w.appId === appId);
      if (existingWindow) {
        return prevWindows.map(w =>
          w.id === existingWindow.id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
        );
      }

      const newWindow: WindowInstance = {
        id: nextId,
        appId: appId,
        title: appTitles[appId],
        x: 100 + (prevWindows.length % 5) * 40,
        y: 100 + (prevWindows.length % 5) * 40,
        width: 800,
        height: 600,
        zIndex: nextZIndex,
        isMinimized: false,
      };
      setNextId(prev => prev + 1);
      setNextZIndex(prev => prev + 1);
      return [...prevWindows, newWindow];
    });
    setNextZIndex(prev => prev + 1);
  }, [nextId, nextZIndex]);

  const closeWindow = (id: number) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: number) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const restoreWindow = (id: number) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w));
    setNextZIndex(prev => prev + 1);
  };

  const focusWindow = (id: number) => {
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(prev => prev + 1);
  };
  
  const activeWindowId = windows.length > 0 ? windows.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current).id : null;
  
  return (
    <main className="w-screen h-screen bg-transparent overflow-hidden">
      <AnimatedBackground />
      <div className="relative w-full h-full">
        <DesktopAppsGrid onOpen={openWindow} />
        <AIOrb onClick={() => openWindow('chat')} />

        {windows.map(window => (
           <Window
              key={window.id}
              id={window.id}
              initialX={window.x}
              initialY={window.y}
              initialWidth={window.width}
              initialHeight={window.height}
              title={window.title}
              zIndex={window.zIndex}
              isMinimized={window.isMinimized}
              isActive={window.id === activeWindowId && !window.isMinimized}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
            >
              {React.createElement(appComponents[window.appId])}
            </Window>
        ))}

        <Dock openWindows={windows} onOpen={openWindow} onRestore={restoreWindow} onFocus={focusWindow} activeWindowId={activeWindowId} />
      </div>
    </main>
  );
};

export default App;