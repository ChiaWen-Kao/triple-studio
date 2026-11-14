import { useEffect } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useServicesReveal(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (
      !section ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const context = gsap.context(() => {
      gsap.fromTo(
        section,
        { autoAlpha: 0, y: 56 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 82%', once: true },
        },
      );
    }, section);
    return () => context.revert();
  }, [sectionRef]);
}
