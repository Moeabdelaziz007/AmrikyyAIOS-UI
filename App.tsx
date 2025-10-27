import React, { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import { WindowInstance, AppID, Settings, TravelPlan, TaskbarTheme } from './types';
import Dock from './components/Dock';
import HologramWallpaper from './components/HologramWallpaper';
import AppLauncher from './components/AppLauncher';
import PoweredByGemini from './components/PoweredByGemini';
import { generateTravelPlan } from './services/geminiAdvancedService';

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
const TravelPlanViewerApp = lazy(() => import('./components/apps/TravelPlanViewerApp'));
const TranscriberApp = lazy(() => import('./components/apps/TranscriberApp'));
const VideoAnalyzerApp = lazy(() => import('./components/apps/VideoAnalyzerApp'));
const JulesApp = lazy(() => import('./components/apps/JulesApp'));
const VoiceAssistantApp = lazy(() => import('./components/apps/VoiceAssistantApp'));
const VeoApp = lazy(() => import('./components/apps/VeoApp'));
const NanoBananaApp = lazy(() => import('./components/apps/NanoBananaApp'));
const YouTubeApp = lazy(() => import('./components/apps/YouTubeApp'));
const GmailApp = lazy(() => import('./components/apps/GmailApp'));
const Window = lazy(() => import('./components/Window'));

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
  travelPlanViewer: TravelPlanViewerApp,
  transcriber: TranscriberApp,
  videoAnalyzer: VideoAnalyzerApp,
  jules: JulesApp,
  voice: VoiceAssistantApp,
  veo: VeoApp,
  nanoBanana: NanoBananaApp,
  youtube: YouTubeApp,
  gmail: GmailApp,
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
  travelPlanViewer: 'AI Travel Plan',
  transcriber: 'Audio Transcriber',
  videoAnalyzer: 'Video Analyzer',
  jules: 'Agent: Jules',
  voice: 'AI Voice Assistant',
  veo: 'Veo Video',
  nanoBanana: 'Nano Banana',
  youtube: 'YouTube',
  gmail: 'Gmail',
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
  });

  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [finalPlan, setFinalPlan] = useState<TravelPlan | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
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

  const startTravelWorkflow = useCallback(async (details: { destination: string, startDate: string, endDate: string, budget: string }) => {
      setFinalPlan(null);
      setIsWorkflowRunning(true);
      setWorkflowStep(0);
      openWindow('workflow');
      
      const stepRunner = (step: number) => {
          setWorkflowStep(step);
          return new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      }

      try {
          await stepRunner(0); // Luna
          await stepRunner(1); // Scout
          await stepRunner(2); // Karim
          
          const plan = await generateTravelPlan(details);
          
          await stepRunner(3); // Maya
          setFinalPlan(plan);

      } catch (error) {
          console.error("Workflow failed:", error);
      } finally {
          setIsWorkflowRunning(false);
      }

  }, [openWindow]);

  const openPlanViewer = useCallback(() => {
      if (!finalPlan) return;
      openWindow('travelPlanViewer', { plan: finalPlan });
  }, [finalPlan, openWindow]);

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
      
      <div className="relative w-full h-full">
        {isAppLauncherOpen && <AppLauncher onOpen={openWindow} onClose={() => setIsAppLauncherOpen(false)} />}

        <Suspense fallback={null}>
            {windows.map(window => (
               <Window
                  key={window.id}
                  id={window.id}
                  initialX={window.x}
                  initialY={window.y}
                  initialWidth={window.appId === 'workflow' || window.appId === 'travelPlanViewer' ? 1024 : window.width}
                  initialHeight={window.appId === 'workflow' || window.appId === 'travelPlanViewer' ? 768 : window.height}
                  title={window.title}
                  zIndex={window.zIndex}
                  isMinimized={window.isMinimized}
                  isActive={window.id === activeWindowId}
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
                          } else if (window.appId === 'trips') {
                              props.startTravelWorkflow = startTravelWorkflow;
                          } else if (window.appId === 'workflow') {
                              props.isWorkflowRunning = isWorkflowRunning;
                              props.currentStep = workflowStep;
                              props.finalPlan = finalPlan;
                              props.onViewPlan = openPlanViewer;
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