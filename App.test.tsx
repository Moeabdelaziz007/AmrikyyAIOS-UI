import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the dock', () => {
    render(<App />);
    const dockElement = screen.getByRole('navigation', { name: /application dock/i });
    expect(dockElement).toBeInTheDocument();
  });

  it('renders the AI orb', () => {
    render(<App />);
    const orbElement = screen.getByRole('button', { name: /open ai assistant/i });
    expect(orbElement).toBeInTheDocument();
  });

  it('opens the AI Chat window when the AI orb is clicked', async () => {
    render(<App />);
    
    // Ensure the window is not present before the click
    expect(screen.queryByRole('dialog', { name: /amrikyy ai chat/i })).not.toBeInTheDocument();

    // Simulate user clicking the AI Orb
    const orbElement = screen.getByRole('button', { name: /open ai assistant/i });
    fireEvent.click(orbElement);

    // `findByRole` waits for the element to appear, handling the lazy loading
    const chatWindow = await screen.findByRole('dialog', { name: /amrikyy ai chat/i });
    expect(chatWindow).toBeInTheDocument();
  });
});