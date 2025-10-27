
import React from 'react';
import { AppID } from '../types';
import { ChatIcon, TripIcon, TerminalIcon, FileIcon, SettingsIcon, ImageIcon, VideoIcon, SearchIcon, MapIcon, LunaIcon, KarimIcon, ScoutIcon, MayaIcon, WorkflowIcon, MicrophoneIcon, VideoAnalyzeIcon, JulesIcon } from './Icons';

interface DesktopAppsGridProps {
    onOpen: (appId: AppID) => void;
}

const apps: { id: AppID; name: string; icon: React.FC<{ className: string }>; color: string, glowColor: string }[] = [
    { id: 'chat', name: 'AI Chat', icon: ChatIcon, color: 'from-blue-500 to-primary-blue', glowColor: '#3B82F6' },
    { id: 'workflow', name: 'Workflow Studio', icon: WorkflowIcon, color: 'from-purple-500 to-primary-purple', glowColor: '#8B5CF6' },
    { id: 'search', name: 'AI Search', icon: SearchIcon, color: 'from-sky-500 to-cyan-400', glowColor: '#06B6D4'},
    { id: 'maps', name: 'AI Maps', icon: MapIcon, color: 'from-teal-500 to-emerald-500', glowColor: '#10B981'},
    { id: 'transcriber', name: 'Transcriber', icon: MicrophoneIcon, color: 'from-fuchsia-500 to-pink-500', glowColor: '#D946EF' },
    { id: 'videoAnalyzer', name: 'Video Analyzer', icon: VideoAnalyzeIcon, color: 'from-indigo-500 to-violet-500', glowColor: '#6D28D9' },
    { id: 'image', name: 'Image Gen', icon: ImageIcon, color: 'from-pink-500 to-primary-pink', glowColor: '#EC4899'},
    { id: 'video', name: 'Video Gen', icon: VideoIcon, color: 'from-rose-500 to-red-500', glowColor: '#EF4444'},
    { id: 'jules', name: 'Agent Jules', icon: JulesIcon, color: 'from-green-500 to-emerald-500', glowColor: '#10B981' },
    { id: 'files', name: 'Files', icon: FileIcon, color: 'from-yellow-500 to-amber-500', glowColor: '#F59E0B'},
    { id: 'settings', name: 'Settings', icon: SettingsIcon, color: 'from-gray-500 to-slate-500', glowColor: '#6B7280' },
    { id: 'terminal', name: 'Terminal', icon: TerminalIcon, color: 'from-gray-800 to-black', glowColor: '#374151'},
];

const DesktopAppsGrid: React.FC<DesktopAppsGridProps> = ({ onOpen }) => {
    return (
        <div className="absolute top-10 left-10 p-4">
            <div className="grid grid-cols-3 gap-6">
                {apps.map(app => {
                    const Icon = app.icon;
                    return (
                        <button
                            key={app.id}
                            onClick={() => onOpen(app.id)}
                            className="flex flex-col items-center justify-center gap-2 w-28 h-28 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 group hover:bg-white/5 transition-colors duration-200 animate-app-icon-glow"
                            style={{'--glow-color': app.glowColor + '50'} as React.CSSProperties}
                            title={`Open ${app.name}`}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-medium text-text-primary">{app.name}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default React.memo(DesktopAppsGrid);
