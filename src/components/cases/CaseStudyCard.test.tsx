import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { caseStudies, CASE_INTERVAL_MS } from '../../constants/cases';
import { CaseStudyCard } from './CaseStudyCard';

let reducedMotion = false;
beforeEach(() => {
  vi.useFakeTimers();
  reducedMotion = false;
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('hover') || reducedMotion,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      callback: IntersectionObserverCallback;
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }
      observe() {
        this.callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      disconnect() {}
    },
  );
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const advance = () => act(() => vi.advanceTimersByTime(CASE_INTERVAL_MS));

describe('case study chapters', () => {
  it('changes the text and animation together on every interval and loops', () => {
    render(<CaseStudyCard study={caseStudies[0]} />);
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '0');
    advance();
    expect(
      screen.getByRole('heading', { name: 'Show what changed.' }),
    ).toBeVisible();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '1');
    advance();
    expect(
      screen.getByRole('heading', { name: 'Keep the useful part.' }),
    ).toBeVisible();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '2');
    advance();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '0');
  });
  it('keeps a manually selected chapter visible until playback is requested', () => {
    render(<CaseStudyCard study={caseStudies[1]} />);
    fireEvent.click(screen.getByRole('button', { name: 'What we learned' }));
    advance();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '2');
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Play Less busywork. More progress.',
      }),
    );
    advance();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '0');
  });
  it('pauses while a visitor is reading with the pointer over the study', () => {
    render(<CaseStudyCard study={caseStudies[0]} />);
    fireEvent.mouseEnter(screen.getByRole('article'));
    advance();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '0');
    fireEvent.mouseLeave(screen.getByRole('article'));
    advance();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '1');
  });
  it('keeps keyboard reading paused when the pointer leaves', () => {
    render(<CaseStudyCard study={caseStudies[0]} />);
    fireEvent.focus(screen.getByRole('button', { name: 'The challenge' }));
    fireEvent.mouseEnter(screen.getByRole('article'));
    fireEvent.mouseLeave(screen.getByRole('article'));
    advance();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '0');
  });
  it('starts without autoplay when reduced motion is requested', () => {
    reducedMotion = true;
    render(<CaseStudyCard study={caseStudies[2]} />);
    advance();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '0');
    fireEvent.click(screen.getByRole('button', { name: 'The outcome' }));
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '1');
  });
  it('swipes text and visual together without treating vertical scrolling as a chapter change', () => {
    render(<CaseStudyCard study={caseStudies[0]} />);
    const card = screen.getByRole('article');
    const pointer = (type: string, x: number, y: number) => {
      fireEvent(
        card,
        new MouseEvent(type, { bubbles: true, clientX: x, clientY: y }),
      );
    };
    pointer('pointerdown', 260, 200);
    pointer('pointerup', 80, 210);
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '1');
    expect(
      screen.getByRole('heading', { name: 'Show what changed.' }),
    ).toBeVisible();
    advance();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '1');
    pointer('pointerdown', 180, 200);
    pointer('pointerup', 175, 420);
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '1');
    pointer('pointerdown', 80, 200);
    pointer('pointerup', 260, 210);
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '0');
  });
  it('does not stop autoplay after a synthetic hover on a touch-only device', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(<CaseStudyCard study={caseStudies[0]} />);
    fireEvent.mouseEnter(screen.getByRole('article'));
    advance();
    expect(screen.getByRole('img')).toHaveAttribute('data-phase', '1');
  });
});
