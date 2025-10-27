import React from 'react';
import { SparklesIcon } from './Icons';

interface AIOrbProps {
  onClick: () => void;
}

const AIOrb: React.FC<AIOrbProps> = ({ onClick }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open AI Assistant"
      onClick={onClick}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
      className="fixed bottom-24 right-10 h-24 w-24 cursor-pointer group"
    >
      <div className="absolute inset-0 rounded-full bg-primary-cyan/20 animate-orb-pulse group-hover:animate-none group-hover:scale-105 transition-transform duration-300" />
      
      {/* Outer Ring */}
      <div className="absolute inset-[-10px] border-2 border-primary-cyan/30 rounded-full animate-ring-spin" style={{animationDirection: 'reverse', animationDuration: '25s'}} />
      
      {/* Inner Ring */}
      <div className="absolute inset-[-20px] border border-primary-purple/20 rounded-full animate-ring-spin" />
      
      {/* Core Orb */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-bg-secondary via-primary-blue/50 to-bg-secondary shadow-2xl shadow-primary-blue/50 flex items-center justify-center">
         <div className="h-16 w-16 rounded-full bg-bg-primary/50 flex items-center justify-center backdrop-blur-sm">
             <SparklesIcon className="h-8 w-8 text-primary-cyan opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
         </div>
      </div>

    </div>
  );
};

export default AIOrb;
