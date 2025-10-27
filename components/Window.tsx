import React, { useState, useRef, useCallback, useEffect } from 'react';

interface WindowProps {
  id: number;
  children: React.ReactNode;
  title: string;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  zIndex: number;
  isMinimized: boolean;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

const Window: React.FC<WindowProps> = ({ children, title, id, initialX, initialY, initialWidth, initialHeight, zIndex, isMinimized, isActive, onClose, onMinimize, onFocus }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && windowRef.current) {
      windowRef.current.focus();
    }
  }, [isActive]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.window-control')) return;
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    e.preventDefault();
  }, [onFocus]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      id={`window-${id}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`window-title-${id}`}
      tabIndex={-1}
      className={`absolute flex flex-col rounded-lg shadow-2xl shadow-black/50 overflow-hidden border animate-slide-up focus:outline-none transition-shadow duration-300 ${isActive ? 'ring-2 ring-primary-blue border-primary-blue/50' : 'border-white/10'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
        minWidth: '300px',
        minHeight: '200px',
        resize: 'both',
        background: 'rgba(17, 24, 39, 0.8)', // bg-secondary with opacity
        backdropFilter: 'blur(20px)',
      }}
      onMouseDown={onFocus}
    >
      <div
        className={`h-10 bg-black/20 flex items-center justify-between px-3 flex-shrink-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <button onClick={onClose} aria-label={`Close ${title} window`} className="window-control h-4 w-4 rounded-full bg-red-500 hover:bg-red-400" />
          <button onClick={onMinimize} aria-label={`Minimize ${title} window`} className="window-control h-4 w-4 rounded-full bg-yellow-500 hover:bg-yellow-400" />
          <button aria-label="Maximize window (disabled)" className="window-control h-4 w-4 rounded-full bg-green-500 hover:bg-green-400 cursor-not-allowed" />
        </div>
         <span id={`window-title-${id}`} className="font-bold text-sm text-text-primary absolute left-1/2 -translate-x-1/2">{title}</span>
         <div />
      </div>
      <div className="flex-grow p-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Window;