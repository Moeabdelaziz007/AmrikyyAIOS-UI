import React, { useRef, useEffect } from 'react';

const HologramWallpaper: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const grid = gridRef.current;
        if (!container || !grid) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY, currentTarget } = e;
            const { clientWidth, clientHeight } = currentTarget as HTMLElement;
            
            const x = (clientX / clientWidth - 0.5) * 2;
            const y = (clientY / clientHeight - 0.5) * 2;

            grid.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(-50px)`;
        };
        
        container.addEventListener('mousemove', handleMouseMove);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            x: number; y: number; size: number; speedX: number; speedY: number;
            constructor() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 1; this.speedX = Math.random() * 0.4 - 0.2; this.speedY = Math.random() * 0.4 - 0.2;
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX; this.y += this.speedY;
            }
            draw() {
                if(!ctx) return;
                ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }

        let particlesArray = Array.from({ length: 70 }, () => new Particle());
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => { p.update(); p.draw(); });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        
        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden flex items-center justify-center" style={{ perspective: '1000px' }}>
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div
                ref={gridRef}
                className="absolute inset-[-50%] transition-transform duration-300 ease-out"
                style={{
                    backgroundSize: '100px 100px',
                    backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                    transformStyle: 'preserve-3d',
                }}
            />
            <div className="absolute font-display text-[12vw] font-bold text-white/5 select-none" style={{textShadow: '0 0 30px var(--accent-color)'}}>
                Amrikyy
            </div>
        </div>
    );
};

export default HologramWallpaper;