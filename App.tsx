import React, { useState, useCallback, Suspense, lazy, useEffect, useMemo } from 'react';
import { WindowInstance, AppID, Settings, TravelPlan, Workflow, Alarm, Automation, Theme, CustomAgent, CommunityAgent, UserAccount, DashboardLayout, CalendarEvent, DriveFile, GmailMessage, Project, Task, PaymentMethod, AgoraListing, SharedContent, CreatorBounty, ViralPost, SocialPost } from './types';
import Dock from './components/Dock';
import AppLauncher from './components/AppLauncher';
import PoweredByGemini from './components/PoweredByGemini';
import TrendingWidget from './components/TrendingWidget';
import WorkflowDashboardWidget from './components/WorkflowDashboardWidget';
import { getCalendarEvents, getDriveFiles, getGmailMessages } from './services/googleWorkspaceService';
import { createCalendarEventFromPlan } from './services/geminiAdvancedService';
import DesktopAppsGrid from './components/DesktopAppsGrid';
import { CreatorStudioIcon, BrowserIcon, ChatIcon, TripIcon, WorkflowIcon, SkillForgeIcon, ChronoVaultIcon, WorkspaceIcon, SmartWatchIcon, EventLogIcon, ImageIcon, LunaIcon, FileIcon, SettingsIcon, TerminalIcon, VoiceAssistantIcon, MarketingIcon, AgentForgeIcon, JulesIcon, StoreIcon, LiveConversationIcon, ImageAnalyzerIcon, NotificationCenterIcon, AgoraIcon, NexusChatIcon, DevConsoleIcon, ApiIcon, DevToolkitIcon, GrowthHubIcon, ResourceHubIcon } from './components/Icons';
import { useLanguage } from './contexts/LanguageContext';
import AnimatedBackground from './components/AnimatedBackground';
import SystemOverviewWidget from './components/SystemOverviewWidget';
import { NotificationCenter } from './components/NotificationCenter';
import { useNotification } from './contexts/NotificationContext';
import CryptoDashboardWidget from './components/CryptoDashboardWidget';
import { useUserBehavior } from './contexts/UserBehaviorContext';
import GlobalVoiceControl from './components/GlobalVoiceControl';
import { useGoogleAuth } from './contexts/GoogleAuthContext';
import ProjectsWidget from './components/widgets/ProjectsWidget';
import TasksWidget from './components/widgets/TasksWidget';
import SharePreview from './components/SharePreview';
import { bounties as mockBounties } from './data/bounties';

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
const AudioStudioApp = lazy(() => import('./components/apps/AudioStudioApp'));
const VideoGeneratorApp = lazy(() => import('./components/apps/VideoGeneratorApp'));
const SmartWatchApp = lazy(() => import('./components/apps/SmartWatchApp'));
const WorkspaceApp = lazy(() => import('./components/apps/WorkspaceApp'));
const EventLogApp = lazy(() => import('./components/apps/EventLogApp'));
const SkillForgeApp = lazy(() => import('./components/apps/SkillForgeApp'));
const ChronoVaultApp = lazy(() => import('./components/apps/ChronoVaultApp'));
const CreatorStudioApp = lazy(() => import('./components/apps/CreatorStudioApp'));
const CognitoBrowserApp = lazy(() => import('./components/apps/CognitoBrowserApp'));
const AnalyticsHubApp = lazy(() => import('./components/apps/AnalyticsHubApp'));
const AgentForgeApp = lazy(() => import('./components/apps/AgentForgeApp'));
const AvatarStudioApp = lazy(() => import('./components/apps/AvatarStudioApp'));
const AgentProfileApp = lazy(() => import('./components/apps/AgentProfileApp'));
const StoreApp = lazy(() => import('./components/apps/StoreApp'));
const NotificationCenterApp = lazy(() => import('./components/apps/NotificationCenterApp'));
const LiveConversationApp = lazy(() => import('./components/apps/LiveConversationApp'));
const ImageAnalyzerApp = lazy(() => import('./components/apps/ImageAnalyzerApp'));
const AgoraApp = lazy(() => import('./components/apps/AgoraApp'));
const NexusChatApp = lazy(() => import('./components/apps/NexusChatApp'));
const DevConsoleApp = lazy(() => import('./components/apps/DevConsoleApp'));
const ApiDocsApp = lazy(() => import('./components/apps/ApiDocsApp'));
const DevToolkitApp = lazy(() => import('./components/apps/DevToolkitApp'));
const GrowthHubApp = lazy(() => import('./components/apps/GrowthHubApp'));
const ResourceHubApp = lazy(() => import('./components/apps/ResourceHubApp'));
const Window = lazy(() => import('./components/Window'));
const ProactiveSuggestionsWidget = lazy(() => import('./components/widgets/ProactiveSuggestionsWidget'));
const WorkspaceHubWidget = lazy(() => import('./components/widgets/WorkspaceHubWidget'));
const ViralFeedWidget = lazy(() => import('./components/widgets/ViralFeedWidget'));


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
  travelPlanViewer: TravelPlanViewerApp,
  search: SearchApp,
  maps: MapsApp,
  transcriber: TranscriberApp,
  videoAnalyzer: VideoAnalyzerApp,
  image: ImageGeneratorApp,
  audio: AudioStudioApp,
  video: VideoGeneratorApp,
  smartwatch: SmartWatchApp,
  workspace: WorkspaceApp,
  eventLog: EventLogApp,
  skillForge: SkillForgeApp,
  chronoVault: ChronoVaultApp,
  creatorStudio: CreatorStudioApp,
  cognitoBrowser: CognitoBrowserApp,
  analyticsHub: AnalyticsHubApp,
  agentForge: AgentForgeApp,
  avatarStudio: AvatarStudioApp,
  agentProfile: AgentProfileApp,
  store: StoreApp,
  notificationCenter: NotificationCenterApp,
  liveConversation: LiveConversationApp,
  imageAnalyzer: ImageAnalyzerApp,
  agora: AgoraApp,
  nexusChat: NexusChatApp,
  marketing: MarketingApp,
  devConsole: DevConsoleApp,
  apiDocs: ApiDocsApp,
  devToolkit: DevToolkitApp,
  growthHub: GrowthHubApp,
  resourceHub: ResourceHubApp,
};

const DEFAULT_SETTINGS: Settings = {
  theme: 'deep-space',
  wallpaper: '/wallpaper.svg',
  accentColor: '#00f0ff',
  taskbarTheme: 'glass',
  windowStyle: 'cyberpunk',
  voice: 'Kore',
  speechRate: 1.0,
  speechPitch: 0,
  dashboardLayout: 'default',
  language: 'en',
};

const AppLoadingSpinner: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="w-8 h-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [nextId, setNextId] = useState(1);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);
  
  const { t, setLanguage } = useLanguage();
  const { addNotification } = useNotification();
  const { logAction, getFrequentApps } = useUserBehavior();
  const { isSignedIn } = useGoogleAuth();
  
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [customAgents, setCustomAgents] = useState<CustomAgent[]>([]);
  const [userAccount, setUserAccount] = useState<UserAccount>({ name: 'User', avatar: '👩‍🚀', tier: 'Free', aiCredits: 1000, referralCode: 'REF123', referralsCount: 0, creditsEarnedFromReferrals: 0, creatorScore: 0 });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [agoraListings, setAgoraListings] = useState<AgoraListing[]>([]);
  const [shareContent, setShareContent] = useState<SharedContent | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [bounties, setBounties] = useState<CreatorBounty[]>(mockBounties);
  const [completedBounties, setCompletedBounties] = useState<Set<string>>(new Set());
  const [viralPosts, setViralPosts] = useState<ViralPost[]>([]);

  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '07:00', label: 'Good Morning!', enabled: true },
    { id: '2', time: '09:00', label: 'Team Standup', enabled: false },
  ]);
  const [automations, setAutomations] = useState<Automation[]>([
     { id: '1', trigger: 'Time is 08:00', action: { appId: 'chat', task: 'Open and say good morning' } }
  ]);
  
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[]>([]);

  const handleSuccessfulReferral = useCallback(() => {
    setUserAccount(prev => ({
        ...prev,
        referralsCount: (prev.referralsCount || 0) + 1,
        creditsEarnedFromReferrals: (prev.creditsEarnedFromReferrals || 0) + 500,
        aiCredits: prev.aiCredits + 500,
    }));
    addNotification("Referral successful! 500 AI Credits added.", 'success');
  }, [addNotification]);
  
  const handleBonusTask = useCallback((credits: number) => {
     setUserAccount(prev => ({
        ...prev,
        aiCredits: prev.aiCredits + credits,
    }));
    addNotification(`${credits} bonus AI Credits added!`, 'success');
  }, [addNotification]);

  const handleAddPaymentMethod = useCallback((method: PaymentMethod) => {
    setPaymentMethods(prev => [...prev, method]);
    addNotification(`Payment method ${method.type} added successfully.`, 'success');
  }, [addNotification]);

  const handlePurchase = useCallback((listing: AgoraListing) => {
    if (userAccount.aiCredits < listing.price) {
        addNotification("Insufficient AI Credits to purchase.", 'error');
        return;
    }
    setUserAccount(prev => ({ ...prev, aiCredits: prev.aiCredits - listing.price }));
    if (listing.type === 'agent') {
        addCustomAgent(listing.asset as CustomAgent);
    }
    // TODO: Handle workflow installation
    addNotification(`${listing.type === 'agent' ? (listing.asset as CustomAgent).name : (listing.asset as Workflow).title} purchased and installed!`, 'success');
  }, [userAccount.aiCredits, addNotification]);

  const handleListOnAgora = useCallback((listing: Omit<AgoraListing, 'id' | 'author'>) => {
    const newListing: AgoraListing = {
        ...listing,
        id: `agora-${Date.now()}`,
        author: userAccount.name,
    };
    setAgoraListings(prev => [newListing, ...prev]);
    addNotification("Your asset has been listed on the Agora Marketplace!", 'success');
  }, [userAccount.name, addNotification]);
  
  const handleCompleteBounty = useCallback((bountyId: string) => {
    setCompletedBounties(prev => new Set(prev).add(bountyId));
    const bounty = bounties.find(b => b.id === bountyId);
    if(bounty) {
        setUserAccount(prev => ({
            ...prev,
            aiCredits: prev.aiCredits + bounty.creditReward,
            creatorScore: (prev.creatorScore || 0) + bounty.creditReward,
        }));
        addNotification(`Bounty complete! +${bounty.creditReward} AI Credits & Creator Score!`, 'success');
    }
  }, [bounties, addNotification]);

  const handleShareAndPost = (content: SharedContent, socialPost: SocialPost) => {
      const newPost: ViralPost = {
        id: `post-${Date.now()}`,
        author: userAccount.name,
        content,
        socialPost,
        likes: 0,
        views: 0,
      };
      setViralPosts(prev => [newPost, ...prev]);
      setShareContent(null);
      addNotification("Your content has been shared to the Creator Spotlight!", 'success');
      // Check for related bounty
      const shareBounty = bounties.find(b => b.action.type === 'share_content' && b.action.contentType === content.type && !completedBounties.has(b.id));
      if(shareBounty) {
        handleCompleteBounty(shareBounty.id);
      }
  };
  
   // Simulate viral feed activity
    useEffect(() => {
        const interval = setInterval(() => {
            setViralPosts(prevPosts => {
                if (prevPosts.length === 0) return prevPosts;
                const postToUpdateIndex = Math.floor(Math.random() * prevPosts.length);
                return prevPosts.map((post, index) => {
                    if (index === postToUpdateIndex) {
                        const wasViral = post.likes >= 1000;
                        const newLikes = post.likes + Math.floor(Math.random() * 50);
                        const becomesViral = newLikes >= 1000;

                        if (becomesViral && !wasViral) {
                             addNotification(`Your post "${post.content.title}" went viral! +500 bonus credits!`, 'success');
                             setUserAccount(prev => ({...prev, aiCredits: prev.aiCredits + 500}));
                        }
                        
                        return { ...post, likes: newLikes, views: post.views + Math.floor(Math.random() * 200) };
                    }
                    return post;
                });
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [addNotification]);


  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (isSignedIn) {
        const results = await Promise.allSettled([
          getCalendarEvents(),
          getDriveFiles(),
          getGmailMessages(),
        ]);

        if (results[0].status === 'fulfilled') setCalendarEvents(results[0].value);
        else addNotification(results[0].reason.message, 'error');
        
        if (results[1].status === 'fulfilled') setDriveFiles(results[1].value);
        else addNotification(results[1].reason.message, 'error');

        if (results[2].status === 'fulfilled') setGmailMessages(results[2].value);
        else addNotification(results[2].reason.message, 'error');

      } else {
        setCalendarEvents([]);
        setDriveFiles([]);
        setGmailMessages([]);
      }
    };
    fetchWorkspaceData();
  }, [isSignedIn, addNotification]);
  
  const appTitles: Record<string, string> = useMemo(() => ({
    chat: t('app_titles.chat'),
    terminal: t('app_titles.terminal'),
    files: t('app_titles.files'),
    settings: t('app_titles.settings'),
    luna: t('app_titles.luna'),
    karim: t('app_titles.karim'),
    scout: t('app_titles.scout'),
    maya: t('app_titles.maya'),
    jules: t('app_titles.jules'),
    voice: t('app_titles.voice'),
    workflow: t('app_titles.workflow'),
    travelAgent: t('app_titles.travelAgent'),
    marketing: t('app_titles.marketing'),
    travelPlanViewer: t('app_titles.travelPlanViewer'),
    search: t('app_titles.search'),
    maps: t('app_titles.maps'),
    transcriber: t('app_titles.transcriber'),
    videoAnalyzer: t('app_titles.videoAnalyzer'),
    image: t('app_titles.image'),
    audio: t('app_titles.audio'),
    video: t('app_titles.video'),
    smartwatch: t('app_titles.smartwatch'),
    workspace: t('app_titles.workspace'),
    eventLog: t('app_titles.eventLog'),
    skillForge: t('app_titles.skillForge'),
    chronoVault: t('app_titles.chronoVault'),
    creatorStudio: t('app_titles.creatorStudio'),
    cognitoBrowser: t('app_titles.cognitoBrowser'),
    analyticsHub: t('app_titles.analyticsHub'),
    agentForge: t('app_titles.agentForge'),
    avatarStudio: t('app_titles.avatarStudio'),
    agentProfile: t('app_titles.agentProfile'),
    store: t('app_titles.store'),
    notificationCenter: t('app_titles.notificationCenter'),
    liveConversation: t('app_titles.liveConversation'),
    imageAnalyzer: t('app_titles.imageAnalyzer'),
    agora: t('app_titles.agora'),
    nexusChat: t('app_titles.nexusChat'),
    devConsole: t('app_titles.devConsole'),
    apiDocs: t('app_titles.apiDocs'),
    devToolkit: t('app_titles.devToolkit'),
    growthHub: t('app_titles.growthHub'),
    resourceHub: t('app_titles.resourceHub'),
  }), [t]);

  const addCustomAgent = useCallback((agent: CustomAgent | CommunityAgent) => {
    setCustomAgents(prev => {
        if (prev.some(a => a.id === agent.id)) return prev;
        const newAgent = { ...agent, id: agent.id || `custom-${Date.now()}` };
        return [...prev, newAgent];
    });
    addNotification(t('notifications.agent_installed', { agentName: agent.name }), 'success');
  }, [addNotification, t]);

  useEffect(() => {
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${settings.theme}`);
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    setLanguage(settings.language);
  }, [settings.theme, settings.accentColor, settings.language, setLanguage]);

  const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  const handleUserAccountChange = useCallback((newAccount: Partial<UserAccount>) => {
    setUserAccount(prev => ({...prev, ...newAccount}));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);
  
  const handleUpgrade = useCallback(() => {
    setUserAccount(prev => ({ ...prev, tier: 'Pro', aiCredits: 5000 }));
    addNotification(t('notifications.upgraded_to_pro'), 'success');
  }, [addNotification, t]);

  const openWindow = useCallback((appId: AppID, appProps: any = {}) => {
    logAction(appId, appProps);
    setIsAppLauncherOpen(false);
    const customAgent = customAgents.find(a => a.id === appId);

    setWindows(prevWindows => {
      const existingWindow = prevWindows.find(w => w.appId === appId && !Object.keys(w.appProps).length && !customAgent);
      if (existingWindow) {
        return prevWindows.map(w =>
          w.id === existingWindow.id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
        );
      }

      const windowAppId = customAgent ? 'agentProfile' : appId;

      const newWindow: WindowInstance = {
        id: nextId,
        appId: windowAppId,
        title: customAgent ? `${t('agent_prefix.agent')}: ${customAgent.name}` : appTitles[appId] || "Application",
        x: 100 + (prevWindows.length % 5) * 40,
        y: 100 + (prevWindows.length % 5) * 40,
        width: ['agentProfile', 'luna', 'karim', 'scout', 'maya', 'jules', 'liveConversation'].includes(windowAppId) ? 500 : 800,
        height: ['agentProfile', 'luna', 'karim', 'scout', 'maya', 'jules', 'liveConversation'].includes(windowAppId) ? 700 : 600,
        zIndex: nextZIndex,
        isMinimized: false,
        appProps: customAgent ? { agent: customAgent } : appProps,
      };
      setNextId(prev => prev + 1);
      setNextZIndex(prev => prev + 1);
      return [...prevWindows, newWindow];
    });
    setNextZIndex(prev => prev + 1);
  }, [nextId, nextZIndex, customAgents, t, appTitles, logAction]);

  const executeCommand = useCallback((command: string) => {
    const [action, target] = command.split(' ');
    if (action === 'open' && target) {
      const appId = target.toLowerCase() as AppID;
      if(Object.keys(appTitles).includes(appId)) {
        openWindow(appId);
      }
    } else if(action === 'close' && target === 'all') {
      setWindows([]);
    }
  }, [openWindow, appTitles]);

  const handleWorkflowComplete = useCallback((result: any) => {
    if (result && 'destination' in result) { // Check if it's a TravelPlan
        openWindow('travelPlanViewer', { plan: result });
    }
  }, [openWindow]);

  const executeWorkflow = useCallback((workflow: Workflow, details?: any) => {
      openWindow('workflow', { workflow, isExecuting: true, executingDetails: details });
  }, [openWindow]);

  const startTravelWorkflow = useCallback(async (details: { destination: string, startDate: string, endDate: string, budget: string }) => {
      const travelWorkflow: Workflow = {
        title: `Generating Travel Plan for ${details.destination}`,
        nodes: [
            { id: '1', agentId: 'luna', description: 'Plan Itinerary' },
            { id: '2', agentId: 'scout', description: 'Find Deals' },
            { id: '3', agentId: 'karim', description: 'Optimize Budget' },
        ],
        connections: [{from: '1', to: '2'}, {from: '2', to: '3'}]
      };
      executeWorkflow(travelWorkflow, details);
  }, [executeWorkflow]);

  const handleAddToCalendar = useCallback(async (plan: TravelPlan) => {
    try {
        const events = await createCalendarEventFromPlan(plan);
        addNotification(`Suggested ${events.length} events for your calendar.`, 'info');
        // In a real app, you'd open a modal to confirm adding events.
        // For this demo, we'll just log them.
        console.log("Generated Calendar Events:", events);
    } catch (e: any) {
        addNotification(e.message, 'error');
    }
  }, [addNotification]);
  
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
  
  const desktopApps = useMemo(() => [
    { id: 'store', name: t('desktop_apps.store'), icon: StoreIcon },
    { id: 'creatorStudio', name: t('desktop_apps.creatorStudio'), icon: CreatorStudioIcon },
    { id: 'cognitoBrowser', name: t('desktop_apps.cognitoBrowser'), icon: BrowserIcon },
    { id: 'chat', name: t('desktop_apps.chat'), icon: ChatIcon },
    { id: 'travelAgent', name: t('desktop_apps.travelAgent'), icon: TripIcon },
    { id: 'workflow', name: t('desktop_apps.workflow'), icon: WorkflowIcon },
    { id: 'agentForge', name: t('desktop_apps.agentForge'), icon: AgentForgeIcon },
    { id: 'chronoVault', name: t('desktop_apps.chronoVault'), icon: ChronoVaultIcon },
    ...customAgents.map(agent => ({
        id: agent.id as AppID,
        name: agent.name,
        icon: agent.avatarVisual ? () => <img src={`/avatars/${agent.avatarVisual}.png`} alt={agent.name} className="w-full h-full object-cover" /> : () => <span className="text-4xl">{agent.icon}</span>
    }))
  ], [customAgents, t]);

  const allAppsForLauncher = useMemo(() => [
    { id: 'store', name: t('app_launcher.store'), icon: StoreIcon },
    { id: 'creatorStudio', name: t('app_launcher.creatorStudio'), icon: CreatorStudioIcon },
    { id: 'cognitoBrowser', name: t('app_launcher.cognitoBrowser'), icon: BrowserIcon },
    { id: 'chat', name: t('app_launcher.chat'), icon: ChatIcon },
    { id: 'voice', name: t('app_launcher.voice'), icon: VoiceAssistantIcon },
    { id: 'travelAgent', name: t('app_launcher.travelAgent'), icon: TripIcon },
    { id: 'workspace', name: t('app_launcher.workspace'), icon: WorkspaceIcon },
    { id: 'smartwatch', name: t('app_launcher.smartwatch'), icon: SmartWatchIcon },
    { id: 'marketing', name: t('app_launcher.marketing'), icon: MarketingIcon },
    { id: 'workflow', name: t('app_launcher.workflow'), icon: WorkflowIcon },
    { id: 'agentForge', name: t('app_launcher.agentForge'), icon: AgentForgeIcon },
    { id: 'avatarStudio', name: t('app_launcher.avatarStudio'), icon: AgentForgeIcon },
    { id: 'skillForge', name: t('app_launcher.skillForge'), icon: SkillForgeIcon },
    { id: 'chronoVault', name: t('app_launcher.chronoVault'), icon: ChronoVaultIcon },
    { id: 'eventLog', name: t('app_launcher.eventLog'), icon: EventLogIcon },
    { id: 'notificationCenter', name: t('app_launcher.notificationCenter'), icon: NotificationCenterIcon },
    { id: 'jules', name: t('app_launcher.jules'), icon: JulesIcon },
    { id: 'files', name: t('app_launcher.files'), icon: FileIcon },
    { id: 'settings', name: t('app_launcher.settings'), icon: SettingsIcon },
    { id: 'terminal', name: t('app_launcher.terminal'), icon: TerminalIcon },
    { id: 'devToolkit', name: t('app_launcher.devToolkit'), icon: DevToolkitIcon },
    { id: 'growthHub', name: t('app_launcher.growthHub'), icon: GrowthHubIcon },
    { id: 'resourceHub', name: t('app_launcher.resourceHub'), icon: ResourceHubIcon },
    ...customAgents.map(agent => ({
        id: agent.id as AppID,
        name: agent.name,
        icon: () => <span className="text-2xl">{agent.icon}</span>
    }))
  ], [customAgents, t]);

  const renderDashboardWidgets = (layout: DashboardLayout) => {
    switch(layout) {
      case 'work':
        return (
          <>
            <Suspense fallback={null}><WorkspaceHubWidget isConnected={isSignedIn} events={calendarEvents} files={driveFiles} messages={gmailMessages} /></Suspense>
            <Suspense fallback={null}><ProactiveSuggestionsWidget onOpenApp={openWindow} /></Suspense>
            <Suspense fallback={null}><ProjectsWidget projects={projects} onOpenApp={openWindow} /></Suspense>
            <Suspense fallback={null}><TasksWidget tasks={tasks.filter(t => !t.completed)} /></Suspense>
          </>
        );
      case 'developer':
        return (
          <>
            <Suspense fallback={null}><ProactiveSuggestionsWidget onOpenApp={openWindow} /></Suspense>
            <WorkflowDashboardWidget onOpenApp={openWindow} />
            <CryptoDashboardWidget />
          </>
        );
      case 'default':
      default:
        return (
          <>
            <Suspense fallback={null}><ViralFeedWidget posts={viralPosts} /></Suspense>
            <WorkflowDashboardWidget onOpenApp={openWindow} />
            <TrendingWidget />
            <CryptoDashboardWidget />
          </>
        );
    }
  }

  return (
    <main className="w-screen h-screen overflow-hidden bg-black">
      <div className="animated-bg-container fixed inset-0 -z-10">
          <AnimatedBackground />
      </div>
      <PoweredByGemini />
      <NotificationCenter />
      <GlobalVoiceControl onCommand={executeCommand} />
      
      {shareContent && <SharePreview content={shareContent} onClose={() => setShareContent(null)} onShare={handleShareAndPost} />}

      <div className="absolute top-4 end-4 z-20 hidden md:flex flex-col gap-4 animate-slide-in-right w-full max-w-sm">
        <div className="glass-effect rounded-xl p-4 flex flex-col gap-4">
          {renderDashboardWidgets(settings.dashboardLayout)}
        </div>
      </div>

      <div className="relative w-full h-full flex flex-col items-center p-4">
        <header className="w-full flex-shrink-0 z-10">
            <SystemOverviewWidget userAccount={userAccount} />
        </header>

        <section className="flex-grow flex items-center justify-center w-full">
            <DesktopAppsGrid onOpen={openWindow} apps={desktopApps} />
        </section>

        {isAppLauncherOpen && <AppLauncher onOpen={openWindow} onClose={() => setIsAppLauncherOpen(false)} allApps={allAppsForLauncher} />}

        <Suspense fallback={null}>
            {windows.map(window => (
               <Window
                  key={window.id}
                  id={window.id}
                  initialX={window.x}
                  initialY={window.y}
                  initialWidth={['workflow', 'travelPlanViewer', 'marketing', 'workspace', 'skillForge', 'chronoVault', 'creatorStudio', 'cognitoBrowser', 'analyticsHub', 'settings', 'agentForge', 'store', 'agora', 'nexusChat', 'devConsole', 'apiDocs', 'devToolkit', 'growthHub', 'resourceHub'].includes(window.appId) ? 1024 : window.appId === 'smartwatch' ? 360 : window.width}
                  initialHeight={['workflow', 'travelPlanViewer', 'marketing', 'workspace', 'skillForge', 'chronoVault', 'creatorStudio', 'cognitoBrowser', 'analyticsHub', 'settings', 'agentForge', 'store', 'agora', 'nexusChat', 'devConsole', 'apiDocs', 'devToolkit', 'growthHub', 'resourceHub'].includes(window.appId) ? 768 : window.appId === 'smartwatch' ? 600 : window.height}
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
                          const AppComponent = appComponents[window.appId as keyof typeof appComponents];
                          if (!AppComponent) return null;
                          const props: any = window.appProps || {};

                          if (window.appId === 'settings') {
                              props.settings = settings;
                              props.onSettingsChange = handleSettingsChange;
                              props.resetSettings = resetSettings;
                              props.userAccount = userAccount;
                              props.onUserAccountChange = handleUserAccountChange;
                              props.paymentMethods = paymentMethods;
                              props.onAddPaymentMethod = handleAddPaymentMethod;
                              props.onSuccessfulReferral = handleSuccessfulReferral;
                              props.onBonusTask = handleBonusTask;
                              props.onUpgrade = handleUpgrade;
                          } else if (window.appId === 'travelAgent') {
                              props.startTravelWorkflow = startTravelWorkflow;
                          } else if (window.appId === 'workflow') {
                              props.onComplete = handleWorkflowComplete;
                          } else if (window.appId === 'voice') {
                              props.onExecuteWorkflow = executeWorkflow;
                          } else if (window.appId === 'travelPlanViewer') {
                              props.onAddToCalendar = handleAddToCalendar;
                              props.onShare = setShareContent;
                          } else if (window.appId === 'smartwatch') {
                              props.alarms = alarms;
                              props.setAlarms = setAlarms;
                              props.automations = automations;
                              props.setAutomations = setAutomations;
                          } else if (['chat', 'audio'].includes(window.appId)) {
                              props.speechSettings = { 
                                voice: settings.voice, 
                                rate: settings.speechRate,
                                pitch: settings.speechPitch,
                              };
                          } else if (window.appId === 'agentForge' || window.appId === 'avatarStudio') {
                              props.onAddAgent = addCustomAgent;
                              props.onClose = () => closeWindow(window.id);
                          } else if (window.appId === 'store') {
                              props.onAddAgent = addCustomAgent;
                              props.installedAgents = customAgents;
                              props.userAccount = userAccount;
                              props.onOpenApp = openWindow;
                          } else if (['video', 'image', 'audio'].includes(window.appId)) {
                              props.userAccount = userAccount;
                              props.setUserAccount = setUserAccount;
                              props.onOpenApp = openWindow;
                          } else if (window.appId === 'agora') {
                              props.userAccount = userAccount;
                              props.customAgents = customAgents;
                              props.listings = agoraListings;
                              props.onList = handleListOnAgora;
                              props.onPurchase = handlePurchase;
                          } else if (window.appId === 'creatorStudio') {
                                props.projects = projects;
                                props.tasks = tasks;
                                props.onAddProject = (p: Project) => { setProjects(prev => [p, ...prev]); logAction('creatorStudio', { event: 'project_created', projectName: p.name }); };
                                props.onAddTask = (t: Task) => setTasks(prev => [t, ...prev]);
                                props.onShare = setShareContent;
                          } else if (window.appId === 'growthHub') {
                                props.userAccount = userAccount;
                                props.bounties = bounties;
                                props.completedBounties = completedBounties;
                                props.onCompleteBounty = handleCompleteBounty;
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
            frequentApps={getFrequentApps(3)}
         />
      </div>
    </main>
  );
};

export default App;