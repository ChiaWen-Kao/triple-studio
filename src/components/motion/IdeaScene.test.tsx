import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { IdeaScene } from './IdeaScene';

let reducedMotion: boolean;
let preferenceChanged: () => void;
let visibilityChanged: (entries: { isIntersecting: boolean }[]) => void;

beforeEach(() => {
  reducedMotion = false;
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reducedMotion;
    },
    addEventListener: (_event: string, callback: () => void) => {
      preferenceChanged = callback;
    },
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: typeof visibilityChanged) {
        visibilityChanged = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => vi.unstubAllGlobals());

it('keeps a manually paused scene paused after leaving and returning to view', () => {
  render(<IdeaScene />);
  fireEvent.click(screen.getByRole('button', { name: 'Pause motion' }));
  act(() => visibilityChanged([{ isIntersecting: false }]));
  act(() => visibilityChanged([{ isIntersecting: true }]));
  expect(screen.getByRole('button', { name: 'Play motion' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(screen.getByRole('region')).toHaveAttribute('data-paused', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Play motion' }));
  expect(screen.getByRole('region')).toHaveAttribute('data-paused', 'false');
});

it('starts paused for reduced motion and responds to preference changes', () => {
  reducedMotion = true;
  render(<IdeaScene />);
  expect(screen.getByRole('button', { name: 'Play motion' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  reducedMotion = false;
  act(() => preferenceChanged());
  expect(screen.getByRole('button', { name: 'Pause motion' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});
