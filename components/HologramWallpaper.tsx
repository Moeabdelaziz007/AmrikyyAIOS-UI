import React from 'react';

const HologramWallpaper: React.FC = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 holographic-bg" />
            <div className="absolute font-display text-[20vw] lg:text-[15vw] font-bold text-white/5 tracking-widest select-none">
                Amrikyy
            </div>
        </div>
    );
};

export default HologramWallpaper;