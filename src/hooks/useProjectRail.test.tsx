import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useProjectRail } from './useProjectRail';

let desktop = true;
let reduced = false;
beforeEach(() => {
  desktop = true;
  reduced = false;
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('reduced') ? reduced : desktop,
  }));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function Story({ onNext }: { onNext: () => void }) {
  const ref = useProjectRail('product', onNext);
  return <div ref={ref} role="region" aria-label="Project story" />;
}
function setup() {
  const onNext = vi.fn();
  render(<Story onNext={onNext} />);
  const rail = screen.getByRole('region');
  Object.defineProperties(rail, {
    scrollWidth: { value: 1000 },
    clientWidth: { value: 400 },
  });
  rail.scrollLeft = 600;
  return { rail, onNext };
}
function keepScrolling(rail: HTMLElement, duration: number) {
  for (let elapsed = 0; elapsed < duration; elapsed += 64) {
    fireEvent.wheel(rail, { deltaY: 100 });
    act(() => vi.advanceTimersByTime(64));
  }
}
it('opens the next project after sustained scrolling at the desktop endpoint', () => {
  const { rail, onNext } = setup();
  keepScrolling(rail, 4700);
  expect(onNext).toHaveBeenCalledTimes(1);
  expect(rail.style.getPropertyValue('--next-progress')).toBe('1');
});
it('clears the endpoint progress when scrolling stops before completion', () => {
  const { rail, onNext } = setup();
  keepScrolling(rail, 1500);
  expect(
    Number(rail.style.getPropertyValue('--next-progress')),
  ).toBeGreaterThan(0);
  act(() => vi.advanceTimersByTime(1000));
  expect(rail.style.getPropertyValue('--next-progress')).toBe('0');
  expect(onNext).not.toHaveBeenCalled();
});
it('leaves vertical phone scrolling native and does not auto-advance', () => {
  desktop = false;
  const { rail, onNext } = setup();
  const event = new WheelEvent('wheel', { deltaY: 100, cancelable: true });
  fireEvent(rail, event);
  keepScrolling(rail, 5000);
  expect(event.defaultPrevented).toBe(false);
  expect(onNext).not.toHaveBeenCalled();
});
it('keeps next-project navigation manual with reduced motion', () => {
  reduced = true;
  const { rail, onNext } = setup();
  keepScrolling(rail, 5000);
  expect(onNext).not.toHaveBeenCalled();
});
