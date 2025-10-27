import { render, screen } from '@testing-library/react';
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
});