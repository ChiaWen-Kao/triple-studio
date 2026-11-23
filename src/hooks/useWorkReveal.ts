import { useEffect, useRef } from 'react';

export function useWorkReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );
    section
      .querySelectorAll('[data-reveal]')
      .forEach((tile) => observer.observe(tile));
    return () => observer.disconnect();
  }, []);
  return sectionRef;
}
