import React from 'react';
import { AppID } from '../types';
import { CreatorStudioIcon, BrowserIcon, ChatIcon, TripIcon, WorkflowIcon, SkillForgeIcon, ChronoVaultIcon, WorkspaceIcon, SmartWatchIcon, EventLogIcon, ImageIcon, LunaIcon, FileIcon, SettingsIcon, TerminalIcon } from './Icons';

interface DesktopAppsGridProps {
    onOpen: (appId: AppID) => void;
}

const apps: { id: AppID; name: string; icon: React.FC<{ className: string }>; }[] = [
    { id: 'creatorStudio', name: 'Creator Studio', icon: CreatorStudioIcon },
    { id: 'cognitoBrowser', name: 'Cognito', icon: BrowserIcon },
    { id: 'chat', name: 'AI Chat', icon: ChatIcon },
    { id: 'travelAgent', name: 'Trip Planner', icon: TripIcon },
    { id: 'workflow', name: 'Workflow Studio', icon: WorkflowIcon },
    { id: 'skillForge', name: 'Skill Forge', icon: SkillForgeIcon },
    { id: 'chronoVault', name: 'Chrono Vault', icon: ChronoVaultIcon },
    { id: 'workspace', name: 'Workspace', icon: WorkspaceIcon },
    { id: 'smartwatch', name: 'Smart Watch', icon: SmartWatchIcon },
    { id: 'eventLog', name: 'Event Log', icon: EventLogIcon },
    { id: 'image', name: 'Image Gen', icon: ImageIcon},
    { id: 'luna', name: 'Agent Luna', icon: LunaIcon },
    { id: 'files', name: 'Files', icon: FileIcon },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
    { id: 'terminal', name: 'Terminal', icon: TerminalIcon},
];

const DesktopAppsGrid: React.FC<DesktopAppsGridProps> = ({ onOpen }) => {
    return (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 sm:p-4">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {apps.map(app => {
                    const Icon = app.icon;
                    return (
                        <button
                            key={app.id}
                            onClick={() => onOpen(app.id)}
                            title={`Open ${app.name}`}
                            className="flex flex-col items-center justify-center text-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-center size-14 bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 rounded-xl">
                                <Icon className="text-3xl text-white" />
                            </div>
                            <p className="text-xs font-medium text-white/90">{app.name}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default React.memo(DesktopAppsGrid);