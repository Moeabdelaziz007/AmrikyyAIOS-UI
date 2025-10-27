import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Taskbar from './Taskbar';
import { WindowInstance } from '../types';

describe('Taskbar', () => {
  const mockOnOpen = vi.fn();
  const mockOnRestore = vi.fn();
  const mockOnFocus = vi.fn();
  
  const defaultProps = {
    openWindows: [],
    onOpen: mockOnOpen,
    onRestore: mockOnRestore,
    onFocus: mockOnFocus,
    activeWindowId: null,
  };

  it('renders correctly', () => {
    render(<Taskbar {...defaultProps} />);
    expect(screen.getByRole('navigation', { name: /main taskbar/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/start menu/i)).toBeInTheDocument();
  });

  it('displays app icons', () => {
    render(<Taskbar {...defaultProps} />);
    // Check for a few key apps
    expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /workflow/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /trips/i })).toBeInTheDocument();
  });

  it('calls onOpen when a new app icon is clicked', () => {
    render(<Taskbar {...defaultProps} />);
    const chatButton = screen.getByRole('button', { name: /chat/i });
    fireEvent.click(chatButton);
    expect(mockOnOpen).toHaveBeenCalledWith('chat');
  });

  it('calls onFocus when an open, non-minimized app is clicked', () => {
    const openWindows: WindowInstance[] = [
      { id: 1, appId: 'chat', title: 'Chat', x: 1, y: 1, width: 1, height: 1, zIndex: 1, isMinimized: false, appProps: {} },
    ];
    render(<Taskbar {...defaultProps} openWindows={openWindows} />);
    const chatButton = screen.getByRole('button', { name: /chat/i });
    fireEvent.click(chatButton);
    expect(mockOnFocus).toHaveBeenCalledWith(1);
  });

  it('calls onRestore when a minimized app is clicked', () => {
    const openWindows: WindowInstance[] = [
        { id: 1, appId: 'chat', title: 'Chat', x: 1, y: 1, width: 1, height: 1, zIndex: 1, isMinimized: true, appProps: {} },
    ];
    render(<Taskbar {...defaultProps} openWindows={openWindows} />);
    const chatButton = screen.getByRole('button', { name: /chat/i });
    fireEvent.click(chatButton);
    expect(mockOnRestore).toHaveBeenCalledWith(1);
  });
});
