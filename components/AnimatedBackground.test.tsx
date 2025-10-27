import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AnimatedBackground from './AnimatedBackground';

describe('AnimatedBackground', () => {
  // Mock the canvas getContext method as it's not implemented in JSDOM
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
    })) as any;
  });
  
  it('renders a canvas element without crashing', () => {
    render(<AnimatedBackground />);
    // JSDOM doesn't render visually, so we can't test the animation.
    // The most we can do is a "smoke test" to ensure it renders the canvas element.
    const canvasElement = document.querySelector('canvas');
    expect(canvasElement).toBeInTheDocument();
  });
});
