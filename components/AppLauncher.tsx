import React, { useState, useMemo } from 'react';
import { AppID } from '../types';
import { ChatIcon, FileIcon, SettingsIcon, WorkflowIcon, JulesIcon, VoiceAssistantIcon, SparklesIcon, TerminalIcon } from './Icons';

interface AppLauncherProps {
    onOpen: (appId: AppID) => void;
    onClose: () => void;
}

const TravelAgentIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const MarketingIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
);

const allApps: { id: AppID; name: string; icon: React.FC<{ className: string }>; }[] = [
    { id: 'chat', name: 'AI Chat', icon: ChatIcon },
    { id: 'voice', name: 'Voice AI', icon: VoiceAssistantIcon },
    { id: 'travelAgent', name: 'Travel Agent', icon: TravelAgentIcon },
    { id: 'marketing', name: 'Marketing', icon: MarketingIcon },
    { id: 'workflow', name: 'Workflow Studio', icon: WorkflowIcon },
    { id: 'jules', name: 'Jules Agent', icon: JulesIcon },
    { id: 'files', name: 'Files', icon: FileIcon },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
    { id: 'terminal', name: 'Terminal', icon: TerminalIcon },
];

const AppLauncher: React.FC<AppLauncherProps> = ({ onOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApps = useMemo(() => {
        if (!searchTerm) return allApps;
        return allApps.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xl flex items-center justify-center animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-2xl h-[70vh] bg-bg-primary/80 rounded-2xl border border-border-color shadow-2xl flex flex-col p-6 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative mb-6">
                    <SparklesIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input 
                        type="text"
                        placeholder="Search apps and agents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 bg-white/5 border border-border-color rounded-lg pl-12 pr-4 text-text-primary focus:ring-2 focus:ring-accent focus:outline-none"
                        autoFocus
                    />
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                     <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-6">
                        {filteredApps.map(app => {
                            const Icon = app.icon;
                            return (
                                <button
                                    key={app.id}
                                    onClick={() => onOpen(app.id)}
                                    className="flex flex-col items-center justify-start gap-2 text-center group"
                                >
                                    <div className="w-16 h-16 rounded-xl bg-bg-secondary flex items-center justify-center text-text-secondary shadow-lg group-hover:scale-110 group-hover:text-text-primary transition-all duration-200">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <span className="text-xs font-medium text-text-primary">{app.name}</span>
                                </button>
                            );
                        })}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AppLauncher;