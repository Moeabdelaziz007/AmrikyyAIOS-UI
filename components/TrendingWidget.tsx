import React from 'react';
import { TrendingItem } from '../types';
import { SparklesIcon } from './Icons';

const trendingData: TrendingItem[] = [
    { rank: 1, name: 'Gemini 2.5 Pro', category: 'Model', change: 0 },
    { rank: 2, name: 'Amrikyy OS v1.0', category: 'Tool', change: 2 },
    { rank: 3, name: 'Veo Video Generation', category: 'Tool', change: -1 },
    { rank: 4, name: 'AI Agents in Prod', category: 'News', change: 1 },
];

const TrendingWidget: React.FC = () => {
    return (
        <div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-neon-pink text-lg">trending_up</span>
                    <h2 className="font-medium text-sm">Trending AI News</h2>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-4">
                {trendingData.map(item => (
                    <div key={item.rank} className="flex flex-col gap-1.5">
                        <h3 className="font-semibold text-white/90 text-sm">{item.rank}. {item.name}</h3>
                        <p className="text-xs text-white/60">The latest update to the AI-native OS includes new dynamic themes and performance enhancements.</p>
                        <p className="text-[10px] text-neon-cyan/80">AMRIKKYY OFFICIAL • {item.rank}d ago</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingWidget;