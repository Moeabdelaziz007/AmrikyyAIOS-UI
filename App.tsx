import React, { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import { WindowInstance, AppID, Settings, TravelPlan, Workflow, Alarm, Automation } from './types';
import Dock from './components/Dock';
import HologramWallpaper from './components/HologramWallpaper';
import AppLauncher from './components/AppLauncher';
import PoweredByGemini from './components/PoweredByGemini';
import TrendingWidget from './components/TrendingWidget';
import WorkflowDashboardWidget from './components/WorkflowDashboardWidget';
import { generateTravelPlan, generateWorkflowFromPrompt } from './services/geminiAdvancedService';
import DailyBriefingWidget from './components/DailyBriefingWidget';
// Fix: Import DesktopAppsGrid component to resolve 'Cannot find name' error.
import DesktopAppsGrid from './components/DesktopAppsGrid';


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
const SearchApp = lazy(() => import('./components/apps/SearchApp'));
const MapsApp = lazy(() => import('./components/apps/MapsApp'));
const TranscriberApp = lazy(() => import('./components/apps/TranscriberApp'));
const VideoAnalyzerApp = lazy(() => import('./components/apps/VideoAnalyzerApp'));
const ImageGeneratorApp = lazy(() => import('./components/apps/ImageGeneratorApp'));
const VideoGeneratorApp = lazy(() => import('./components/apps/VideoGeneratorApp'));
const VeoApp = lazy(() => import('./components/apps/VeoApp'));
const NanoBananaApp = lazy(() => import('./components/apps/NanoBananaApp'));
const YouTubeApp = lazy(() => import('./components/apps/YouTubeApp'));
const GmailApp = lazy(() => import('./components/apps/GmailApp'));
const SmartWatchApp = lazy(() => import('./components/apps/SmartWatchApp'));
const WorkspaceApp = lazy(() => import('./components/apps/WorkspaceApp'));
const EventLogApp = lazy(() => import('./components/apps/EventLogApp'));
const SkillForgeApp = lazy(() => import('./components/apps/SkillForgeApp'));
const ChronoVaultApp = lazy(() => import('./components/apps/ChronoVaultApp'));
const CreatorStudioApp = lazy(() => import('./components/apps/CreatorStudioApp'));
const CognitoBrowserApp = lazy(() => import('./components/apps/CognitoBrowserApp'));
const AnalyticsHubApp = lazy(() => import('./components/apps/AnalyticsHubApp'));
// Fix: Lazy load AgentsDashboardApp to use as a placeholder for new agent apps.
const AgentsDashboardApp = lazy(() => import('./components/apps/AgentsDashboardApp'));


const Window = lazy(() => import('./components/Window'));

// Fix: Add missing 'atlas', 'cortex', and 'orion' properties to satisfy the Record<AppID, ...> type.
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
  atlas: AgentsDashboardApp,
  cortex: AgentsDashboardApp,
  orion: AgentsDashboardApp,
  voice: VoiceAssistantApp,
  workflow: WorkflowStudioApp,
  travelAgent: TravelAgentApp,
  marketing: MarketingApp,
  travelPlanViewer: TravelPlanViewerApp,
  search: SearchApp,
  maps: MapsApp,
  transcriber: TranscriberApp,
  videoAnalyzer: VideoAnalyzerApp,
  image: ImageGeneratorApp,
  video: VideoGeneratorApp,
  veo: VeoApp,
  nanoBanana: NanoBananaApp,
  youtube: YouTubeApp,
  gmail: GmailApp,
  smartwatch: SmartWatchApp,
  workspace: WorkspaceApp,
  eventLog: EventLogApp,
  skillForge: SkillForgeApp,
  chronoVault: ChronoVaultApp,
  creatorStudio: CreatorStudioApp,
  cognitoBrowser: CognitoBrowserApp,
  analyticsHub: AnalyticsHubApp,
};

// Fix: Add missing 'atlas', 'cortex', and 'orion' titles to satisfy the Record<AppID, string> type.
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
  atlas: 'Agent: Atlas',
  cortex: 'Agent: Cortex',
  orion: 'Agent: Orion',
  voice: 'AI Voice Assistant',
  workflow: 'Workflow Studio',
  travelAgent: 'Travel Agent Pro',
  marketing: 'Marketing Copilot',
  travelPlanViewer: 'AI Travel Plan',
  search: 'AI Search',
  maps: 'AI Maps',
  transcriber: 'Audio Transcriber',
  videoAnalyzer: 'Video Analyzer',
  image: 'AI Image Generator',
  video: 'AI Video Generator',
  veo: 'Veo Video Hub',
  nanoBanana: 'Nano Banana Image Hub',
  youtube: 'YouTube',
  gmail: 'Gmail',
  smartwatch: 'Smart Watch',
  workspace: 'Collaborative Workspace',
  eventLog: 'System Event Log',
  skillForge: 'Skill Forge',
  chronoVault: 'Chrono Vault',
  creatorStudio: 'Creator Studio',
  cognitoBrowser: 'Cognito Browser',
  analyticsHub: 'Analytics Hub',
};

const AppLoadingSpinner: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
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
    accentColor: '#00f0ff',
    taskbarTheme: 'glass',
    windowStyle: 'cyberpunk',
  });

  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '07:00', label: 'Good Morning!', enabled: true },
    { id: '2', time: '09:00', label: 'Team Standup', enabled: false },
  ]);
  const [automations, setAutomations] = useState<Automation[]>([
     { id: '1', trigger: 'Time is 08:00', action: { appId: 'chat', task: 'Open and say good morning' } }
  ]);

  useEffect(() => {
    // The new design is dark by default, no need to manage theme classes on root
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
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
    openWindow('workflow', { workflow, isExecuting: true });
  }, [openWindow]);

  const startTravelWorkflow = useCallback(async (details: { destination: string, startDate: string, endDate: string, budget: string }) => {
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
    <main className="w-screen h-screen overflow-hidden">
      <HologramWallpaper />
      <PoweredByGemini />
      
      {/* Desktop Widget Dashboard */}
      <div className="absolute top-4 right-4 z-20 hidden md:flex flex-col gap-4 animate-slide-in-right w-full max-w-sm">
        <div className="glass-effect rounded-xl p-4 flex flex-col gap-4">
          <DailyBriefingWidget />
          <WorkflowDashboardWidget onOpenApp={openWindow} />
          <TrendingWidget />
        </div>
      </div>


      <div className="relative w-full h-full">
        <DesktopAppsGrid onOpen={openWindow} />

        {isAppLauncherOpen && <AppLauncher onOpen={openWindow} onClose={() => setIsAppLauncherOpen(false)} />}

        <Suspense fallback={null}>
            {windows.map(window => (
               <Window
                  key={window.id}
                  id={window.id}
                  initialX={window.x}
                  initialY={window.y}
                  initialWidth={['workflow', 'travelPlanViewer', 'marketing', 'workspace', 'skillForge', 'chronoVault', 'creatorStudio', 'cognitoBrowser', 'analyticsHub'].includes(window.appId) ? 1024 : window.appId === 'smartwatch' ? 360 : window.width}
                  initialHeight={['workflow', 'travelPlanViewer', 'marketing', 'workspace', 'skillForge', 'chronoVault', 'creatorStudio', 'cognitoBrowser', 'analyticsHub'].includes(window.appId) ? 768 : window.appId === 'smartwatch' ? 600 : window.height}
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
                          } else if (window.appId === 'smartwatch') {
                              props.alarms = alarms;
                              props.setAlarms = setAlarms;
                              props.automations = automations;
                              props.setAutomations = setAutomations;
                          } else if (window.appId === 'cognitoBrowser') {
                              props.onOpenWindow = openWindow;
                          }
                          
                          return <AppComponent {...props} onOpenApp={openWindow} />;
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
