import React, { useState, useMemo } from 'react';
import { AppID } from '../types';
import { ChatIcon, TripIcon, TerminalIcon, FileIcon, SettingsIcon, ImageIcon, VideoIcon, SearchIcon, MapIcon, LunaIcon, KarimIcon, ScoutIcon, MayaIcon, WorkflowIcon, MicrophoneIcon, VideoAnalyzeIcon, JulesIcon, VoiceAssistantIcon, VeoIcon, NanoBananaIcon, YouTubeIcon, GmailIcon } from './Icons';

interface AppLauncherProps {
    onOpen: (appId: AppID) => void;
    onClose: () => void;
}

const allApps: { id: AppID; name: string; icon: React.FC<{ className: string }>; }[] = [
    { id: 'chat', name: 'AI Chat', icon: ChatIcon },
    { id: 'voice', name: 'Voice AI', icon: VoiceAssistantIcon },
    { id: 'workflow', name: 'Workflow Studio', icon: WorkflowIcon },
    { id: 'trips', name: 'Trip Planner', icon: TripIcon },
    { id: 'search', name: 'AI Search', icon: SearchIcon },
    { id: 'maps', name: 'AI Maps', icon: MapIcon },
    { id: 'transcriber', name: 'Transcriber', icon: MicrophoneIcon },
    { id: 'videoAnalyzer', name: 'Video Analyzer', icon: VideoAnalyzeIcon },
    { id: 'image', name: 'Image Gen', icon: ImageIcon },
    { id: 'video', name: 'Video Gen', icon: VideoIcon },
    { id: 'veo', name: 'Veo', icon: VeoIcon },
    { id: 'nanoBanana', name: 'Nano Banana', icon: NanoBananaIcon },
    { id: 'youtube', name: 'YouTube', icon: YouTubeIcon },
    { id: 'gmail', name: 'Gmail', icon: GmailIcon },
    { id: 'luna', name: 'Agent Luna', icon: LunaIcon },
    { id: 'karim', name: 'Agent Karim', icon: KarimIcon },
    { id: 'scout', name: 'Agent Scout', icon: ScoutIcon },
    { id: 'maya', name: 'Agent Maya', icon: MayaIcon },
    { id: 'jules', name: 'Agent Jules', icon: JulesIcon },
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
                <input 
                    type="text"
                    placeholder="Search apps and agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-border-color rounded-lg px-4 mb-6 text-text-primary focus:ring-2 focus:ring-accent focus:outline-none"
                    autoFocus
                />
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
                 <div className="mt-6 pt-4 border-t border-border-color flex justify-around">
                    {/* Quick Toggles */}
                 </div>
            </div>
        </div>
    );
};

export default AppLauncher;