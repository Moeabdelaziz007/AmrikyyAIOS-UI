
import React, { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import { WindowInstance, AppID, Settings } from './types';
import Window from './components/Window';
import Dock from './components/Dock';
import AIOrb from './components/AIOrb';
import AnimatedBackground from './components/AnimatedBackground';
import DesktopAppsGrid from './components/DesktopAppsGrid';

// Lazy load all application components for code-splitting and performance
const ChatApp = lazy(() => import('./components/apps/ChatApp'));
const TripPlannerApp = lazy(() => import('./components/apps/TripPlannerApp'));
const TerminalApp = lazy(() => import('./components/apps/TerminalApp'));
const FilesApp = lazy(() => import('./components/apps/FilesApp'));
const SettingsApp = lazy(() => import('./components/apps/SettingsApp'));
const ImageGeneratorApp = lazy(() => import('./components/apps/ImageGeneratorApp'));
const VideoGeneratorApp = lazy(() => import('./components/apps/VideoGeneratorApp'));
const SearchApp = lazy(() => import('./components/apps/SearchApp'));
const MapsApp = lazy(() => import('./components/apps/MapsApp'));
const LunaApp = lazy(() => import('./components/apps/LunaApp'));
const KarimApp = lazy(() => import('./components/apps/KarimApp'));
const ScoutApp = lazy(() => import('./components/apps/ScoutApp'));
const MayaApp = lazy(() => import('./components/apps/MayaApp'));
const WorkflowStudioApp = lazy(() => import('./components/apps/WorkflowStudioApp'));

const appComponents: Record<AppID, React.LazyExoticComponent<React.FC<any>>> = {
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
  workflow: WorkflowStudioApp,
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
  workflow: 'Workflow Studio',
};

const AppLoadingSpinner: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [nextId, setNextId] = useState(1);
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    wallpaper: '/wallpaper.svg',
    accentColor: '#3B82F6',
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(settings.theme);
    root.style.setProperty('--accent-color', settings.accentColor);
  }, [settings]);

  const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

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
    <main 
      className="w-screen h-screen bg-bg-primary bg-cover bg-center overflow-hidden transition-colors duration-500"
      style={{
        backgroundImage: settings.wallpaper.startsWith('/') ? `url(${settings.wallpaper})` : 'none',
      }}
    >
      {settings.wallpaper === 'live' && <AnimatedBackground />}
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
              <Suspense fallback={<AppLoadingSpinner />}>
                {window.appId === 'settings' 
                    ? <SettingsApp settings={settings} onSettingsChange={handleSettingsChange} />
                    : React.createElement(appComponents[window.appId])
                }
              </Suspense>
            </Window>
        ))}

        <Dock openWindows={windows} onOpen={openWindow} onRestore={restoreWindow} onFocus={focusWindow} activeWindowId={activeWindowId} />
      </div>
    </main>
  );
};

export default App;