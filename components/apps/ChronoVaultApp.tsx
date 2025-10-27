import React from 'react';
import { ChronoVaultIcon, SearchIcon, UploadIcon } from '../Icons';

// Mock data for the knowledge graph
const engrams = [
    { id: 'paris_trip', label: 'Paris Trip Plan', x: 20, y: 50, color: 'cyan' },
    { id: 'tokyo_budget', label: 'Tokyo Budget', x: 40, y: 20, color: 'yellow' },
    { id: 'seo_strategy', label: 'SEO Strategy', x: 60, y: 70, color: 'pink' },
    { id: 'workspace_notes', label: 'Workspace Q3', x: 80, y: 40, color: 'indigo' },
    { id: 'user_pref', label: 'User Prefs', x: 50, y: 50, color: 'purple' },
];
const connections = [
    { from: 'user_pref', to: 'paris_trip' },
    { from: 'user_pref', to: 'tokyo_budget' },
    { from: 'seo_strategy', to: 'workspace_notes' },
    { from: 'paris_trip', to: 'tokyo_budget' },
];

const ChronoVaultApp: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col bg-bg-tertiary rounded-b-md text-white overflow-hidden">
            <header className="flex-shrink-0 p-4 border-b border-border-color flex items-center gap-3">
                <ChronoVaultIcon className="w-8 h-8 text-primary-purple"/>
                <h1 className="font-display text-2xl font-bold">Chrono Vault - Memory Center</h1>
            </header>
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                <main className="flex-grow p-4 md:p-6 flex flex-col">
                     <h2 className="text-xl font-bold font-display mb-4">Knowledge Graph</h2>
                     <div className="relative flex-grow bg-black/20 rounded-lg border border-border-color p-4 overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 800 400">
                             {connections.map((conn, i) => {
                                const fromNode = engrams.find(e => e.id === conn.from)!;
                                const toNode = engrams.find(e => e.id === conn.to)!;
                                return <line key={i} x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} x2={`${toNode.x}%`} y2={`${toNode.y}%`} className="stroke-white/20" strokeWidth="2" />;
                            })}
                            {engrams.map(engram => (
                                <g key={engram.id} transform={`translate(${(engram.x / 100) * 800}, ${(engram.y / 100) * 400})`}>
                                    <circle r="30" fill={`var(--primary-${engram.color})`} className="opacity-20" />
                                    <circle r="15" fill={`var(--primary-${engram.color})`} />
                                    <text y="45" textAnchor="middle" className="fill-current text-xs font-mono">{engram.label}</text>
                                </g>
                            ))}
                        </svg>
                     </div>
                </main>
                 <aside className="w-full md:w-72 flex-shrink-0 bg-black/20 p-4 md:p-6 border-t md:border-t-0 md:border-l border-border-color overflow-y-auto space-y-6">
                    <div>
                        <h2 className="text-xl font-bold font-display mb-3">Recall Memory</h2>
                        <div className="relative">
                            <input type="text" placeholder="Search memories..." className="w-full bg-black/20 border border-white/10 rounded-md p-2 pl-8 focus:ring-1 focus:ring-primary-purple focus:outline-none text-sm" />
                            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        </div>
                    </div>
                     <div>
                        <h2 className="text-xl font-bold font-display mb-3">Ingest Data</h2>
                        <button className="w-full flex items-center justify-center gap-2 py-2 font-semibold rounded-lg bg-accent/20 text-accent hover:bg-accent/40 transition-colors">
                            <UploadIcon className="w-5 h-5" />
                            Upload Document
                        </button>
                         <p className="text-xs text-text-muted mt-2 text-center">Upload files to expand the OS's knowledge base.</p>
                    </div>
                 </aside>
            </div>
        </div>
    );
};

export default ChronoVaultApp;