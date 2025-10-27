import React, { useState, useRef, useCallback, useEffect } from 'react';
import { WindowStyle } from '../types';

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
  windowStyle: WindowStyle;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

const WindowControls: React.FC<{ onClose: () => void; onMinimize: () => void; style: WindowStyle; title: string; }> = ({ onClose, onMinimize, style, title }) => {
    if (style === 'gemini') {
        return (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2 opacity-0 group-hover/titlebar:opacity-100 transition-opacity">
                <button onClick={onClose} aria-label={`Close ${title} window`} className="window-control h-3.5 w-3.5 rounded-full bg-red-500 hover:bg-red-400" />
                <button onClick={onMinimize} aria-label={`Minimize ${title} window`} className="window-control h-3.5 w-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400" />
                <button aria-label="Maximize window (disabled)" className="window-control h-3.5 w-3.5 rounded-full bg-green-500 hover:bg-green-400 cursor-not-allowed" />
            </div>
        );
    }
    // macOS & Futuristic styles
    return (
        <div className="flex items-center space-x-2">
            <button onClick={onClose} aria-label={`Close ${title} window`} className="window-control h-4 w-4 rounded-full bg-red-500 hover:bg-red-400" />
            <button onClick={onMinimize} aria-label={`Minimize ${title} window`} className="window-control h-4 w-4 rounded-full bg-yellow-500 hover:bg-yellow-400" />
            <button aria-label="Maximize window (disabled)" className="window-control h-4 w-4 rounded-full bg-green-500 hover:bg-green-400 cursor-not-allowed" />
        </div>
    );
};

const Window: React.FC<WindowProps> = ({ children, title, id, initialX, initialY, initialWidth, initialHeight, zIndex, isMinimized, isActive, windowStyle, onClose, onMinimize, onFocus }) => {
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

  const styleConfig = {
      macos: {
          container: `shadow-2xl shadow-black/50 border ${isActive ? 'ring-2 ring-accent border-accent/50' : 'border-border-color'}`,
          titlebar: 'h-10 bg-black/20 justify-between px-3',
          title: 'font-bold text-sm absolute left-1/2 -translate-x-1/2',
          body: 'p-1',
          background: 'var(--glass-bg)',
      },
      gemini: {
          container: `shadow-2xl shadow-black/50 border ${isActive ? 'border-accent/50' : 'border-border-color'}`,
          titlebar: 'h-10 justify-center group/titlebar',
          title: 'font-semibold text-sm',
          body: 'p-0.5',
          background: 'var(--bg-tertiary)',
      },
      futuristic: {
          container: `shadow-2xl shadow-accent/20 border-2 ${isActive ? 'border-accent' : 'border-border-color'}`,
          titlebar: 'h-10 bg-black/30 justify-between px-3',
          title: 'font-mono uppercase text-accent text-sm absolute left-1/2 -translate-x-1/2',
          body: 'p-1',
          background: 'var(--bg-primary)',
      },
  }
  const currentStyle = styleConfig[windowStyle];

  return (
    <div
      ref={windowRef}
      id={`window-${id}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`window-title-${id}`}
      tabIndex={-1}
      className={`absolute flex flex-col rounded-lg overflow-hidden animate-slide-up focus:outline-none transition-shadow,border duration-300 ${currentStyle.container}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
        minWidth: '300px',
        minHeight: '200px',
        resize: 'both',
        background: currentStyle.background,
        backdropFilter: windowStyle !== 'futuristic' ? 'blur(20px)' : 'none',
      }}
      onMouseDown={onFocus}
    >
      <div
        className={`relative flex items-center flex-shrink-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${currentStyle.titlebar}`}
        onMouseDown={handleMouseDown}
      >
          {windowStyle === 'gemini' && isActive && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink opacity-30 animate-gradient-pan [background-size:200%_auto]" style={{ filter: 'blur(20px)'}} />}
          <WindowControls onClose={onClose} onMinimize={onMinimize} style={windowStyle} title={title} />
          <span id={`window-title-${id}`} className={`text-text-primary ${currentStyle.title}`}>{title}</span>
          <div />
      </div>
      <div className={`flex-grow overflow-auto bg-bg-tertiary ${currentStyle.body}`}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(Window);