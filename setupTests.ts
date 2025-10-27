import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia for components that use it (like some UI libraries) in JSDOM
// This prevents errors in tests when components rely on responsive media queries.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
