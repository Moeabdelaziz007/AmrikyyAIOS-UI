import React from 'react';

const MaterialIcon: React.FC<{ className?: string; children: string }> = ({ className, children }) => (
    <span className={`material-symbols-outlined ${className}`}>{children}</span>
);

export const ChatIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>chat_bubble</MaterialIcon>);
export const TripIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>flight_takeoff</MaterialIcon>);
export const TerminalIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>terminal</MaterialIcon>);
export const SendIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>send</MaterialIcon>);
export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>auto_awesome</MaterialIcon>);
export const GridIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>apps</MaterialIcon>);
export const FileIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>folder</MaterialIcon>);
export const SettingsIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>settings</MaterialIcon>);
export const ImageIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>image</MaterialIcon>);
export const VideoIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>movie</MaterialIcon>);
export const SearchIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>search</MaterialIcon>);
export const MapIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>map</MaterialIcon>);

// Agent Icons
export const LunaIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>smart_toy</MaterialIcon>);
export const KarimIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>smart_toy</MaterialIcon>);
export const ScoutIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>smart_toy</MaterialIcon>);
export const MayaIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>smart_toy</MaterialIcon>);
export const JulesIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>smart_toy</MaterialIcon>);
export const CortexIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>hub</MaterialIcon>);
export const AtlasIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>smart_toy</MaterialIcon>);
export const OrionIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>public</MaterialIcon>);

export const WorkflowIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>account_tree</MaterialIcon>);
export const FlightsIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>flight</MaterialIcon>);
export const YouTubeIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>play_circle</MaterialIcon>);
export const SpeakerIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>volume_up</MaterialIcon>);
export const MicrophoneIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>mic</MaterialIcon>);
export const VideoAnalyzeIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>video_search</MaterialIcon>);
export const UploadIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>upload</MaterialIcon>);
export const VoiceAssistantIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>settings_voice</MaterialIcon>);
export const VeoIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>videocam</MaterialIcon>);
export const NanoBananaIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>palette</MaterialIcon>);
export const GmailIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>mail</MaterialIcon>);
export const SmartWatchIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>watch</MaterialIcon>);
export const WorkspaceIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>group_work</MaterialIcon>);
export const EventLogIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>list_alt</MaterialIcon>);
export const CreatorStudioIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>workspaces</MaterialIcon>);
export const SkillForgeIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>construction</MaterialIcon>);
export const ChronoVaultIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>history_toggle_off</MaterialIcon>);
export const BrowserIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>public</MaterialIcon>);
export const AnalyticsHubIcon: React.FC<{className?: string}> = ({className}) => (<MaterialIcon className={className}>insights</MaterialIcon>);