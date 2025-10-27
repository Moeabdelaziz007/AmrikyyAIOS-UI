import React from 'react';
import { AppID, WindowInstance } from '../types';
// FIX: Import all missing icon components to resolve compilation errors.
import { ChatIcon, TripIcon, TerminalIcon, FileIcon, SettingsIcon, ImageIcon, VideoIcon, SearchIcon, MapIcon, LunaIcon, KarimIcon, ScoutIcon, MayaIcon, WorkflowIcon, MicrophoneIcon, VideoAnalyzeIcon, JulesIcon, VoiceAssistantIcon, SmartWatchIcon, WorkspaceIcon, EventLogIcon, CreatorStudioIcon, SkillForgeIcon, ChronoVaultIcon, BrowserIcon, AtlasIcon, CortexIcon, OrionIcon, AnalyticsHubIcon, AgentForgeIcon, StoreIcon, PricingIcon, LiveConversationIcon, ImageAnalyzerIcon, NotificationCenterIcon, AudioStudioIcon, AvatarStudioIcon, MarketingIcon, DevToolkitIcon, AgoraIcon, NexusChatIcon, HeliosIcon, DevConsoleIcon, ApiIcon, GrowthHubIcon, ResourceHubIcon } from './Icons';

interface TaskbarProps {
  openWindows: WindowInstance[];
  onOpen: (appId: AppID) => void;
  onRestore: (id: number) => void;
  onFocus: (id: number) => void;
  activeWindowId: number | null;
}

// Dummy component for type safety, as VideoGeneratorApp is lazy-loaded elsewhere.
const VideoGeneratorApp: React.FC<{className: string}> = ({className}) => <VideoIcon className={className}/>;

// FIX: Add all missing properties to satisfy the Record<AppID, ...> type. This resolves all compilation errors in this file.
const appIcons: Record<AppID, React.FC<{className: string}>> = {
  chat: ChatIcon,
  travelAgent: TripIcon,
  terminal: TerminalIcon,
  files: FileIcon,
  settings: SettingsIcon,
  image: ImageIcon,
  video: VideoGeneratorApp,
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
  marketing: MarketingIcon,
  smartwatch: SmartWatchIcon,
  workspace: WorkspaceIcon,
  eventLog: EventLogIcon,
  creatorStudio: CreatorStudioIcon,
  skillForge: SkillForgeIcon,
  chronoVault: ChronoVaultIcon,
  cognitoBrowser: BrowserIcon,
  atlas: AtlasIcon,
  cortex: CortexIcon,
  orion: OrionIcon,
  analyticsHub: AnalyticsHubIcon,
  agentForge: AgentForgeIcon,
  agentProfile: LunaIcon,
  store: StoreIcon,
  notificationCenter: NotificationCenterIcon,
  liveConversation: LiveConversationIcon,
  imageAnalyzer: ImageAnalyzerIcon,
  audio: AudioStudioIcon,
  avatarStudio: AvatarStudioIcon,
  devToolkit: DevToolkitIcon,
  agora: AgoraIcon,
  nexusChat: NexusChatIcon,
  helios: HeliosIcon,
  devConsole: DevConsoleIcon,
  apiDocs: ApiIcon,
  leo: MarketingIcon,
  zara: MarketingIcon,
  rex: MarketingIcon,
  clio: MarketingIcon,
  growthHub: GrowthHubIcon,
  resourceHub: ResourceHubIcon,
};


const Taskbar: React.FC<TaskbarProps> = ({ openWindows, onOpen, onRestore, onFocus, activeWindowId }) => {
  return null; // This is a legacy component, replaced by Dock. Kept for type safety.
};

export default React.memo(Taskbar);