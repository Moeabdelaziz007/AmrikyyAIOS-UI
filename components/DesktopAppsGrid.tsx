import React from 'react';
import { AppID } from '../types';
import { ChatIcon, TripIcon, TerminalIcon, FileIcon, SettingsIcon, ImageIcon, VideoIcon, SearchIcon, MapIcon, LunaIcon, KarimIcon, ScoutIcon, MayaIcon, WorkflowIcon, MicrophoneIcon, VideoAnalyzeIcon, JulesIcon, VoiceAssistantIcon, VeoIcon, NanoBananaIcon, YouTubeIcon, GmailIcon } from './Icons';

interface DesktopAppsGridProps {
    onOpen: (appId: AppID) => void;
}

const apps: { id: AppID; name: string; icon: React.FC<{ className: string }>; color: string }[] = [
    { id: 'chat', name: 'AI Chat', icon: ChatIcon, color: 'from-blue-500 to-primary-blue' },
    { id: 'voice', name: 'Voice AI', icon: VoiceAssistantIcon, color: 'from-cyan-500 to-primary-cyan' },
    { id: 'workflow', name: 'Workflow Studio', icon: WorkflowIcon, color: 'from-purple-500 to-primary-purple' },
    // Fix: Replace invalid 'trips' AppID with 'travelAgent'.
    { id: 'travelAgent', name: 'Trip Planner', icon: TripIcon, color: 'from-sky-500 to-cyan-400' },
    { id: 'search', name: 'AI Search', icon: SearchIcon, color: 'from-sky-500 to-cyan-400'},
    { id: 'maps', name: 'AI Maps', icon: MapIcon, color: 'from-teal-500 to-emerald-500'},
    { id: 'transcriber', name: 'Transcriber', icon: MicrophoneIcon, color: 'from-fuchsia-500 to-pink-500' },
    { id: 'videoAnalyzer', name: 'Video Analyzer', icon: VideoAnalyzeIcon, color: 'from-indigo-500 to-violet-500' },
    { id: 'image', name: 'Image Gen', icon: ImageIcon, color: 'from-pink-500 to-primary-pink'},
    { id: 'video', name: 'Video Gen', icon: VideoIcon, color: 'from-rose-500 to-red-500'},
    { id: 'veo', name: 'Veo', icon: VeoIcon, color: 'from-orange-500 to-amber-500'},
    { id: 'nanoBanana', name: 'Nano Banana', icon: NanoBananaIcon, color: 'from-yellow-400 to-yellow-500'},
    { id: 'youtube', name: 'YouTube', icon: YouTubeIcon, color: 'from-red-600 to-red-700'},
    { id: 'gmail', name: 'Gmail', icon: GmailIcon, color: 'from-rose-400 to-red-500'},
    { id: 'luna', name: 'Agent Luna', icon: LunaIcon, color: 'from-blue-400 to-cyan-300' },
    { id: 'karim', name: 'Agent Karim', icon: KarimIcon, color: 'from-yellow-400 to-orange-300' },
    { id: 'scout', name: 'Agent Scout', icon: ScoutIcon, color: 'from-purple-400 to-indigo-300' },
    { id: 'maya', name: 'Agent Maya', icon: MayaIcon, color: 'from-pink-400 to-rose-300' },
    { id: 'jules', name: 'Agent Jules', icon: JulesIcon, color: 'from-green-400 to-emerald-300' },
    { id: 'files', name: 'Files', icon: FileIcon, color: 'from-yellow-500 to-amber-500'},
    { id: 'settings', name: 'Settings', icon: SettingsIcon, color: 'from-gray-500 to-slate-500' },
    { id: 'terminal', name: 'Terminal', icon: TerminalIcon, color: 'from-gray-700 to-gray-800'},
];

const DesktopAppsGrid: React.FC<DesktopAppsGridProps> = ({ onOpen }) => {
    return (
        <div className="absolute top-10 left-10 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" style={{ perspective: '1000px' }}>
                {apps.map(app => {
                    const Icon = app.icon;
                    return (
                        <div key={app.id} className="group" style={{ transformStyle: 'preserve-3d' }}>
                             <button
                                onClick={() => onOpen(app.id)}
                                className="relative flex flex-col items-center justify-center gap-2 w-28 h-28 rounded-2xl bg-bg-secondary/50 shadow-neumorphic group-hover:shadow-neumorphic-inset transition-all duration-300 group-hover:-translate-y-1 group-hover:[transform:rotateX(10deg)]"
                                title={`Open ${app.name}`}
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <span className="text-xs font-medium text-text-primary">{app.name}</span>
                                {app.id === 'chat' && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-bg-secondary">3</div>
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default React.memo(DesktopAppsGrid);