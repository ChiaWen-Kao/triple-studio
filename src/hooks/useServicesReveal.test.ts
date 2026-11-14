import { renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { gsap } from 'gsap';
import { useServicesReveal } from './useServicesReveal';

vi.mock('gsap', () => ({
  gsap: { registerPlugin: vi.fn(), context: vi.fn(), fromTo: vi.fn() },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it('keeps services visible without an entrance animation when reduced motion is requested', () => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
  renderHook(() =>
    useServicesReveal({ current: document.createElement('section') }),
  );
  expect(gsap.context).not.toHaveBeenCalled();
});

it('reverts the animation context when the section unmounts', () => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
  const revert = vi.fn();
  vi.mocked(gsap.context).mockReturnValue({
    revert,
  } as unknown as gsap.Context);
  const { unmount } = renderHook(() =>
    useServicesReveal({ current: document.createElement('section') }),
  );
  unmount();
  expect(revert).toHaveBeenCalledOnce();
});
