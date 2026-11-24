import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { LiquidWordmark } from './LiquidWordmark';
import { createLiquidWordmark } from '../../graphics/createLiquidWordmark';

vi.mock('../../graphics/createLiquidWordmark', () => ({
  createLiquidWordmark: vi.fn(),
}));
const createScene = vi.mocked(createLiquidWordmark);
const setPaused = vi.fn();
const dispose = vi.fn();
let reducedMotion = false;
let changePreference: () => void;

beforeEach(() => {
  vi.clearAllMocks();
  reducedMotion = false;
  createScene.mockReturnValue({ setPaused, dispose });
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reducedMotion;
    },
    addEventListener: (_event: string, callback: () => void) => {
      changePreference = callback;
    },
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => vi.unstubAllGlobals());

it('starts still for reduced motion and lets the visitor control playback', async () => {
  reducedMotion = true;
  const { unmount } = render(<LiquidWordmark />);
  const play = await screen.findByRole('button', { name: 'Play motion' });
  expect(setPaused).toHaveBeenLastCalledWith(true);
  fireEvent.click(play);
  expect(setPaused).toHaveBeenLastCalledWith(false);
  expect(screen.getByRole('button', { name: 'Pause motion' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  act(() => changePreference());
  expect(setPaused).toHaveBeenLastCalledWith(true);
  unmount();
  expect(dispose).toHaveBeenCalledOnce();
});

it('keeps the wordmark readable if WebGL cannot start', async () => {
  createScene.mockImplementation(() => {
    throw new Error('WebGL unavailable');
  });
  render(<LiquidWordmark />);
  await waitFor(() => expect(createScene).toHaveBeenCalled());
  expect(screen.getByText('WENDAVA')).toBeVisible();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.getByRole('group')).toHaveAttribute('data-ready', 'false');
});
