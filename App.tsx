import React, { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import { WindowInstance, AppID, Settings, TravelPlan, Workflow } from './types';
import Dock from './components/Dock';
import HologramWallpaper from './components/HologramWallpaper';
import AppLauncher from './components/AppLauncher';
import PoweredByGemini from './components/PoweredByGemini';
import TrendingWidget from './components/TrendingWidget';
import { generateTravelPlan, generateWorkflowFromPrompt } from './services/geminiAdvancedService';

// Lazy load all application components for code-splitting and performance
const ChatApp = lazy(() => import('./components/apps/ChatApp'));
const TerminalApp = lazy(() => import('./components/apps/TerminalApp'));
const FilesApp = lazy(() => import('./components/apps/FilesApp'));
const SettingsApp = lazy(() => import('./components/apps/SettingsApp'));
const LunaApp = lazy(() => import('./components/apps/LunaApp'));
const KarimApp = lazy(() => import('./components/apps/KarimApp'));
const ScoutApp = lazy(() => import('./components/apps/ScoutApp'));
const MayaApp = lazy(() => import('./components/apps/MayaApp'));
const JulesApp = lazy(() => import('./components/apps/JulesApp'));
const VoiceAssistantApp = lazy(() => import('./components/apps/VoiceAssistantApp'));
const WorkflowStudioApp = lazy(() => import('./components/apps/WorkflowStudioApp'));
const TravelAgentApp = lazy(() => import('./components/apps/TravelAgentApp'));
const MarketingApp = lazy(() => import('./components/apps/MarketingApp'));
const TravelPlanViewerApp = lazy(() => import('./components/apps/TravelPlanViewerApp'));

const Window = lazy(() => import('./components/Window'));

const appComponents: Record<AppID, React.LazyExoticComponent<React.FC<any>>> = {
  chat: ChatApp,
  terminal: TerminalApp,
  files: FilesApp,
  settings: SettingsApp,
  luna: LunaApp,
  karim: KarimApp,
  scout: ScoutApp,
  maya: MayaApp,
  jules: JulesApp,
  voice: VoiceAssistantApp,
  workflow: WorkflowStudioApp,
  travelAgent: TravelAgentApp,
  marketing: MarketingApp,
  travelPlanViewer: TravelPlanViewerApp,
};

const appTitles: Record<AppID, string> = {
  chat: 'Amrikyy AI Chat',
  terminal: 'Terminal',
  files: 'File Explorer',
  settings: 'System Settings',
  luna: 'Agent: Luna',
  karim: 'Agent: Karim',
  scout: 'Agent: Scout',
  maya: 'Agent: Maya',
  jules: 'Agent: Jules',
  voice: 'AI Voice Assistant',
  workflow: 'Workflow Studio',
  travelAgent: 'Travel Agent Pro',
  marketing: 'Marketing Copilot',
  travelPlanViewer: 'AI Travel Plan',
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
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);
  
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    wallpaper: '/wallpaper.svg',
    accentColor: '#3B82F6',
    taskbarTheme: 'glass',
    windowStyle: 'gemini',
  });

  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [finalPlan, setFinalPlan] = useState<TravelPlan | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.className = ''; // Clear all previous theme classes
    root.classList.add(settings.theme);
    root.style.setProperty('--accent-color', settings.accentColor);
  }, [settings]);

  const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const openWindow = useCallback((appId: AppID, appProps: any = {}) => {
    setIsAppLauncherOpen(false);
    setWindows(prevWindows => {
      const existingWindow = prevWindows.find(w => w.appId === appId && !Object.keys(w.appProps).length);
      if (existingWindow && !existingWindow.isMinimized) {
        return prevWindows.map(w =>
          w.id === existingWindow.id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
        );
      }
       if (existingWindow && existingWindow.isMinimized) {
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
        appProps,
      };
      setNextId(prev => prev + 1);
      setNextZIndex(prev => prev + 1);
      return [...prevWindows, newWindow];
    });
    setNextZIndex(prev => prev + 1);
  }, [nextId, nextZIndex]);

  const executeWorkflow = useCallback((workflow: Workflow) => {
    openWindow('workflow', { workflow });
  }, [openWindow]);

  const startTravelWorkflow = useCallback(async (details: { destination: string, startDate: string, endDate: string, budget: string }) => {
      setFinalPlan(null);
      setIsWorkflowRunning(true);
      setWorkflowStep(0);
      
      const workflow: Workflow = {
          title: "Automated Travel Plan Generation",
          nodes: [
              { id: 'luna', agentId: 'luna', description: 'Generating Itinerary...' },
              { id: 'scout', agentId: 'scout', description: 'Finding Deals & Links...' },
              { id: 'karim', agentId: 'karim', description: 'Creating Budget...' },
              { id: 'maya', agentId: 'maya', description: 'Compiling Final Plan...' },
          ],
          connections: [ { from: 'luna', to: 'scout' }, { from: 'scout', to: 'karim' }, { from: 'karim', to: 'maya' } ]
      };

      openWindow('workflow', { 
          workflow,
          isExecuting: true,
          onComplete: (plan: TravelPlan) => {
              setFinalPlan(plan);
              openWindow('travelPlanViewer', { plan });
          },
          executingDetails: details
      });

  }, [openWindow]);
  
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
  
  const activeWindowId = windows.length > 0 ? windows.filter(w => !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.id : null;
  
  return (
    <main 
      className="w-screen h-screen bg-bg-primary bg-cover bg-center overflow-hidden transition-colors duration-500"
      style={{ backgroundImage: `url(${settings.wallpaper})` }}
    >
      <HologramWallpaper />
      <PoweredByGemini />
      <TrendingWidget />
      
      <div className="relative w-full h-full">
        {isAppLauncherOpen && <AppLauncher onOpen={openWindow} onClose={() => setIsAppLauncherOpen(false)} />}

        <Suspense fallback={null}>
            {windows.map(window => (
               <Window
                  key={window.id}
                  id={window.id}
                  initialX={window.x}
                  initialY={window.y}
                  initialWidth={window.appId === 'workflow' || window.appId === 'travelPlanViewer' || window.appId === 'marketing' ? 1024 : window.width}
                  initialHeight={window.appId === 'workflow' || window.appId === 'travelPlanViewer' || window.appId === 'marketing' ? 768 : window.height}
                  title={window.title}
                  zIndex={window.zIndex}
                  isMinimized={window.isMinimized}
                  isActive={window.id === activeWindowId}
                  windowStyle={settings.windowStyle}
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => minimizeWindow(window.id)}
                  onFocus={() => focusWindow(window.id)}
                >
                  <Suspense fallback={<AppLoadingSpinner />}>
                    {
                      (() => {
                          const AppComponent = appComponents[window.appId];
                          const props: any = window.appProps || {};

                          if (window.appId === 'settings') {
                              props.settings = settings;
                              props.onSettingsChange = handleSettingsChange;
                          } else if (window.appId === 'travelAgent') {
                              props.startTravelWorkflow = startTravelWorkflow;
                          } else if (window.appId === 'voice') {
                              props.onExecuteWorkflow = executeWorkflow;
                          }
                          
                          return <AppComponent {...props} />;
                      })()
                    }
                  </Suspense>
                </Window>
            ))}
        </Suspense>

        <Dock 
            openWindows={windows} 
            onOpen={openWindow} 
            onRestore={restoreWindow} 
            onFocus={focusWindow} 
            activeWindowId={activeWindowId}
            onToggleLauncher={() => setIsAppLauncherOpen(prev => !prev)}
            taskbarTheme={settings.taskbarTheme}
         />
      </div>
    </main>
  );
};

export default App;