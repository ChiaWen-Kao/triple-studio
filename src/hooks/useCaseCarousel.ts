import { useEffect, useRef, useState } from 'react';
import { CASE_INTERVAL_MS } from '../constants/cases';

export function useCaseCarousel(count: number) {
  const elementRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const playing = visible && pageVisible && !paused && !hovered && !focused;
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    if (elementRef.current) observer.observe(elementRef.current);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => setPaused(preference.matches);
    const onVisibility = () => setPageVisible(!document.hidden);
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % count),
      CASE_INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [count, playing, index]);
  const select = (nextIndex: number) => {
    setIndex(nextIndex);
    setPaused(true);
  };
  return {
    elementRef,
    index,
    paused,
    playing,
    select,
    setHovered,
    setFocused,
    toggle: () => {
      setFocused(false);
      setPaused((current) => !current);
    },
  };
}
