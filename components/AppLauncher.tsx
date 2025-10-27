import React, { useState, useMemo } from 'react';
import { AppID } from '../types';
import { SparklesIcon } from './Icons';

interface AppDef {
    id: AppID;
    name: string;
    icon: React.FC<{ className: string }>;
}

interface AppLauncherProps {
    onOpen: (appId: AppID) => void;
    onClose: () => void;
    allApps: AppDef[];
}

const AppLauncher: React.FC<AppLauncherProps> = ({ onOpen, onClose, allApps }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApps = useMemo(() => {
        if (!searchTerm) return allApps;
        return allApps.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, allApps]);

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xl flex items-center justify-center animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="w-full h-full sm:w-full sm:max-w-2xl sm:h-[70vh] bg-bg-primary/80 rounded-none sm:rounded-2xl border-border-color shadow-2xl flex flex-col p-6 animate-slide-up"
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