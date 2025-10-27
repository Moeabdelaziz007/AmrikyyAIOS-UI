import React from 'react';
import { Agent } from '../types';

interface HologramCardProps {
    agent: Agent;
}

const HologramCard: React.FC<HologramCardProps> = ({ agent }) => {
    
    const GlitchText: React.FC<{ text: string }> = ({ text }) => (
        <div className="relative" data-text={text}>
            {text}
            <div className="absolute top-0 left-0 w-full h-full animate-glitch-anim" style={{ 
                textShadow: '-2px 0 var(--glow-color)', 
                clipPath: 'rect(24px, 550px, 90px, 0)'
            }}>
                {text}
            </div>
        </div>
    );

    return (
        <div 
            className={`relative p-5 rounded-xl overflow-hidden border border-white/10 bg-black/20 animate-hologram-glow`}
            style={{ '--glow-color': agent.hologram.glow } as React.CSSProperties}
        >
            {/* Scan Lines Overlay */}
            <div 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                    background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${agent.hologram.glow}1A 2px, ${agent.hologram.glow}1A 4px)`
                }}
            />

            <div className="relative z-10 animate-hologram-flicker">
                <div className={`flex items-center justify-between mb-4 ${agent.hologram.color}`} style={{ textShadow: `0 0 5px ${agent.hologram.glow}, 0 0 10px ${agent.hologram.glow}`}}>
                    <h2 className="text-xl font-bold tracking-widest">{agent.name.toUpperCase()} ACTIVE</h2>
                    <span className="text-4xl">{agent.icon}</span>
                </div>
                
                <div className="h-20 my-4 flex items-center justify-center opacity-50">
                    {/* Placeholder for 3D network visualization */}
                    <svg width="100%" height="100%" viewBox="0 0 200 80">
                        <defs>
                            <linearGradient id={`grad-${agent.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={agent.hologram.glow} stopOpacity="0" />
                                <stop offset="50%" stopColor={agent.hologram.glow} stopOpacity="1" />
                                <stop offset="100%" stopColor={agent.hologram.glow} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <circle cx="20" cy="40" r="5" fill={agent.hologram.glow} />
                        <circle cx="80" cy="20" r="5" fill={agent.hologram.glow} />
                        <circle cx="80" cy="60" r="5" fill={agent.hologram.glow} />
                        <circle cx="140" cy="40" r="5" fill={agent.hologram.glow} />
                        <circle cx="180" cy="40" r="5" fill={agent.hologram.glow} />
                        <path d="M 25 40 H 75 L 80 35" stroke={agent.hologram.glow} strokeWidth="1" fill="none" />
                        <path d="M 80 45 L 75 40" stroke={agent.hologram.glow} strokeWidth="1" fill="none" />
                        <path d="M 85 20 H 135" stroke={agent.hologram.glow} strokeWidth="1" fill="none" />
                        <path d="M 85 60 H 135" stroke={agent.hologram.glow} strokeWidth="1" fill="none" />
                        <path d="M 145 40 H 175" stroke={agent.hologram.glow} strokeWidth="1" fill="none" />
                    </svg>
                </div>
                
                <div className="w-full bg-black/30 rounded-full h-2.5 my-2">
                    <div className="h-2.5 rounded-full" style={{ width: `${agent.tasks * 1.5}%`, backgroundColor: agent.hologram.glow }}></div>
                </div>
                <div className={`mt-2 text-sm font-mono ${agent.hologram.color}`}>
                    <GlitchText text={agent.hologram.task} />
                </div>
            </div>
        </div>
    );
};

export default HologramCard;
