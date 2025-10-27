import React from 'react';
import { TrendingItem } from '../types';
import { SparklesIcon } from './Icons';

const trendingData: TrendingItem[] = [
    { rank: 1, name: 'Gemini 2.5 Pro', category: 'Model', change: 0 },
    { rank: 2, name: 'Amrikyy OS v1.0', category: 'Tool', change: 2 },
    { rank: 3, name: 'Veo Video Generation', category: 'Tool', change: -1 },
    { rank: 4, name: 'AI Agents in Prod', category: 'News', change: 1 },
    { rank: 5, name: 'Project IDX', category: 'Tool', change: -2 },
];

const ArrowUp: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
    </svg>
);
const ArrowDown: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
    </svg>
);

const TrendingWidget: React.FC = () => {
    return (
        <div className="fixed top-6 right-6 w-80 z-20 animate-slide-in-right">
            <div className="bg-glass-bg backdrop-blur-lg rounded-xl border border-border-color p-4 shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="w-5 h-5 text-primary-purple" />
                    <h2 className="font-display font-bold text-lg">Trending in AI & MCP</h2>
                </div>
                <ul className="space-y-2">
                    {trendingData.map(item => (
                        <li key={item.rank} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <span className="font-bold text-lg text-text-secondary w-5">{item.rank}</span>
                            <div className="flex-grow">
                                <p className="font-semibold text-sm text-text-primary">{item.name}</p>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    item.category === 'Model' ? 'bg-blue-500/30 text-blue-300' :
                                    item.category === 'Tool' ? 'bg-cyan-500/30 text-cyan-300' :
                                    'bg-purple-500/30 text-purple-300'
                                }`}>{item.category}</span>
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${item.change > 0 ? 'text-green-400' : item.change < 0 ? 'text-red-400' : 'text-text-muted'}`}>
                                {item.change > 0 && <ArrowUp className="w-3 h-3"/>}
                                {item.change < 0 && <ArrowDown className="w-3 h-3"/>}
                                {Math.abs(item.change) > 0 && <span>{Math.abs(item.change)}</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TrendingWidget;
