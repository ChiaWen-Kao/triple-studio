import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const NEXT_PROJECT_HOLD_MS = 4500;
const WHEEL_ACTIVITY_MS = 200;
const NEXT_PROJECT_RESET_MS = 350;

export function useProjectRail(projectId: string, onNext: () => void) {
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollLeft = 0;
    rail.scrollTop = 0;
    rail.style.setProperty('--next-progress', '0');
    rail.dataset.atEnd = 'false';
    const desktop = window.matchMedia('(min-width: 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let destination = 0;
    let tween: gsap.core.Tween | undefined;
    let progress = 0;
    let lastWheel = 0;
    let lastFrame = 0;
    let frame = 0;
    let navigating = false;
    const resetProgress = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      progress = 0;
      rail.style.setProperty('--next-progress', '0');
    };
    const advanceProgress = (now: number) => {
      const elapsed = Math.max(0, now - lastFrame);
      const scrolling = now - lastWheel < WHEEL_ACTIVITY_MS;
      lastFrame = now;
      progress += scrolling
        ? elapsed / NEXT_PROJECT_HOLD_MS
        : -elapsed / NEXT_PROJECT_RESET_MS;
      progress = Math.max(0, Math.min(1, progress));
      rail.style.setProperty('--next-progress', String(progress));
      if (progress === 1) {
        navigating = true;
        onNext();
      } else if (progress > 0 || scrolling) {
        frame = requestAnimationFrame(advanceProgress);
      } else {
        frame = 0;
      }
    };
    const handleWheel = (event: WheelEvent) => {
      if (!desktop.matches || event.ctrlKey || navigating) return;
      event.preventDefault();
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? rail.clientWidth
            : 1;
      const end = rail.scrollWidth - rail.clientWidth;
      if (delta > 0 && rail.scrollLeft >= end - 2 && !reduced.matches) {
        lastWheel = performance.now();
        if (!frame) {
          lastFrame = lastWheel;
          frame = requestAnimationFrame(advanceProgress);
        }
        return;
      }
      resetProgress();
      if (!tween?.isActive()) destination = rail.scrollLeft;
      destination = Math.max(0, Math.min(end, destination + delta * unit));
      tween = gsap.to(rail, {
        scrollLeft: destination,
        duration: reduced.matches ? 0 : 0.65,
        ease: 'power3.out',
        overwrite: true,
      });
    };
    const handleScroll = () => {
      rail.dataset.atEnd = String(
        desktop.matches &&
          rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2,
      );
    };
    const handlePointerDown = () => {
      tween?.kill();
      resetProgress();
    };
    const handleResize = () => {
      tween?.kill();
      resetProgress();
      destination = rail.scrollLeft;
      handleScroll();
    };
    rail.addEventListener('scroll', handleScroll);
    rail.addEventListener('wheel', handleWheel, { passive: false });
    rail.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleResize);
    return () => {
      tween?.kill();
      cancelAnimationFrame(frame);
      rail.removeEventListener('scroll', handleScroll);
      rail.removeEventListener('wheel', handleWheel);
      rail.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [projectId, onNext]);
  return railRef;
}
