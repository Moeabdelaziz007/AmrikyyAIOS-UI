import React from 'react';
import { AppID, WindowInstance } from '../types';
// Fix: Import missing icon components.
import { ChatIcon, TripIcon, TerminalIcon, FileIcon, SettingsIcon, ImageIcon, VideoIcon, SearchIcon, MapIcon, LunaIcon, KarimIcon, ScoutIcon, MayaIcon, WorkflowIcon, MicrophoneIcon, VideoAnalyzeIcon, JulesIcon, VoiceAssistantIcon, VeoIcon, NanoBananaIcon, YouTubeIcon, GmailIcon, SmartWatchIcon, WorkspaceIcon, EventLogIcon, CreatorStudioIcon, SkillForgeIcon, ChronoVaultIcon, BrowserIcon, AtlasIcon, CortexIcon, AnalyticsHubIcon } from './Icons';

interface TaskbarProps {
  openWindows: WindowInstance[];
  onOpen: (appId: AppID) => void;
  onRestore: (id: number) => void;
  onFocus: (id: number) => void;
  activeWindowId: number | null;
}

// Fix: Add missing properties 'atlas', 'cortex', 'orion', and 'analyticsHub' to satisfy the Record<AppID, ...> type.
const appIcons: Record<AppID, React.FC<{className: string}>> = {
  chat: ChatIcon,
  travelAgent: TripIcon,
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
  gmail: GmailIcon,
  marketing: ChatIcon,
  smartwatch: SmartWatchIcon,
  workspace: WorkspaceIcon,
  eventLog: EventLogIcon,
  creatorStudio: CreatorStudioIcon,
  skillForge: SkillForgeIcon,
  chronoVault: ChronoVaultIcon,
  cognitoBrowser: BrowserIcon,
  atlas: AtlasIcon,
  cortex: CortexIcon,
  orion: BrowserIcon,
  analyticsHub: AnalyticsHubIcon,
};

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, onOpen, onRestore, onFocus, activeWindowId }) => {
  return null; // This is a legacy component, replaced by Dock. Kept for type safety.
};

export default React.memo(Taskbar);
