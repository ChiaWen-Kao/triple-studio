import { useLayoutEffect, useRef } from 'react';
import type { ServiceMode } from '../types/services';
import {
  syncServiceCardHeights,
  updateServiceCardOpacity,
} from '../utils/serviceStack';

export function useServiceStack(mode: ServiceMode) {
  const sectionRef = useRef<HTMLElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<{ top: number; progress: number } | null>(null);

  function preserveScrollPosition() {
    const stack = sectionRef.current?.querySelector('#services-stack');
    if (!stack) return;
    const rect = stack.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const anchor = window.scrollY + window.innerHeight * 0.35;
    anchorRef.current =
      anchor >= top && anchor <= top + rect.height
        ? { top, progress: (anchor - top) / rect.height }
        : null;
  }

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const measurement = measurementRef.current;
    if (!section || !measurement) return;
    const steps = Array.from(
      section.querySelectorAll<HTMLElement>('.services__stack .services__step'),
    );
    const layout = () => {
      syncServiceCardHeights(section, measurement);
      updateServiceCardOpacity(steps);
    };
    layout();
    const anchor = anchorRef.current;
    if (anchor) {
      const height = section
        .querySelector('#services-stack')!
        .getBoundingClientRect().height;
      window.scrollBy({
        top:
          anchor.top +
          anchor.progress * height -
          (window.scrollY + window.innerHeight * 0.35),
        behavior: 'instant',
      });
      anchorRef.current = null;
      updateServiceCardOpacity(steps);
    }
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        updateServiceCardOpacity(steps);
        frame = 0;
      });
    };
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        layout();
        frame = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [mode]);

  return { sectionRef, measurementRef, preserveScrollPosition };
}
