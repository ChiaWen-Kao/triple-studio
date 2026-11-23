import { useEffect, useState, type RefObject } from 'react';

export function useMascotMotion(scene: RefObject<HTMLDivElement | null>) {
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPaused(preference.matches);
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting);
    });
    observer.observe(element);
    let frame = 0;
    const updatePosition = () => {
      const bounds = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -bounds.top / bounds.height));
      element.style.setProperty(
        '--scene-travel',
        `${paused ? 0 : progress * 65}px`,
      );
      frame = 0;
    };
    const schedulePosition = () => {
      if (!frame) frame = requestAnimationFrame(updatePosition);
    };
    updatePosition();
    window.addEventListener('scroll', schedulePosition, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedulePosition);
    };
  }, [scene, paused]);

  return { paused, setPaused };
}
