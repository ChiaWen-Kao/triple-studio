import { useEffect, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getJourneyPose } from '../constants/journey';

gsap.registerPlugin(ScrollTrigger);

export function useJourneyMotion(sectionRef: RefObject<HTMLElement | null>) {
  const [chapterIndex, setChapterIndex] = useState(0);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767px)',
        short: '(max-height: 600px)',
      },
      ({ conditions }) => {
        if (!conditions?.motion || conditions.short) return;
        const section = sectionRef.current!;
        const pieces = gsap.utils.toArray<HTMLElement>(
          '.journey-piece',
          section,
        );
        gsap.set(pieces, { xPercent: -50, yPercent: -50 });
        const art = section.querySelector<HTMLElement>('.journey-art')!;
        const radius = () =>
          Math.min(art.clientWidth * 0.32, art.clientHeight * 0.35, 130);
        const pose = (index: number, stage: number) =>
          getJourneyPose(index, stage, radius());
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: () => `top ${conditions.mobile ? 84 : 108}px`,
            end: conditions.mobile ? '+=110%' : '+=160%',
            pin: '.journey-stage',
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) =>
              setChapterIndex(progress < 0.34 ? 0 : progress < 0.72 ? 1 : 2),
          },
        });
        pieces.forEach((piece, index) => {
          timeline.fromTo(
            piece,
            pose(index, 0),
            { ...pose(index, 1), duration: 0.75, ease: 'power2.inOut' },
            0.25,
          );
          timeline.to(
            piece,
            { ...pose(index, 2), duration: 0.85, ease: 'power2.inOut' },
            1.3,
          );
        });
        timeline.fromTo(
          '.journey-progress-fill',
          { scaleX: 0 },
          { scaleX: 1, duration: 2.6, ease: 'none' },
          0,
        );
        timeline.to(
          '.journey-chapter-0',
          { autoAlpha: 0, y: -15, duration: 0.15 },
          0.75,
        );
        timeline.fromTo(
          '.journey-chapter-1',
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.2 },
          0.9,
        );
        timeline.to(
          '.journey-chapter-1',
          { autoAlpha: 0, y: -15, duration: 0.15 },
          1.7,
        );
        timeline.fromTo(
          '.journey-chapter-2',
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.2 },
          1.85,
        );
      },
      sectionRef,
    );
    return () => media.revert();
  }, [sectionRef]);
  return chapterIndex;
}
