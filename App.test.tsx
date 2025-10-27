import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the heavy HologramWallpaper component to speed up tests
vi.mock('./components/HologramWallpaper', () => ({
  default: () => <div data-testid="hologram-wallpaper" />,
}));

describe('App', () => {
  it('renders the application dock', () => {
    render(<App />);
    const dockElement = screen.getByRole('navigation', { name: /application dock/i });
    expect(dockElement).toBeInTheDocument();
  });

  it('opens the Travel Agent app when its icon in the dock is clicked', async () => {
    render(<App />);
    
    // Window should not be present before the click
    expect(screen.queryByRole('dialog', { name: /travel agent pro/i })).not.toBeInTheDocument();

    // Find the Travel Agent icon in the Dock by its accessible name
    const travelIcon = screen.getByRole('button', { name: /travel agent/i });
    fireEvent.click(travelIcon);

    // `findByRole` waits for the element to appear
    const travelWindow = await screen.findByRole('dialog', { name: /travel agent pro/i });
    expect(travelWindow).toBeInTheDocument();
  });
});