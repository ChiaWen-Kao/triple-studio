import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const chapters = [
  {
    name: 'The idea',
    title: 'It starts with a “what if”.',
    copy: 'A new idea. A daily frustration. A better way to do things.',
  },
  {
    name: 'The thinking',
    title: 'Find the part that matters.',
    copy: 'We ask, explore and test—until the next step feels clear.',
  },
  {
    name: 'The outcome',
    title: 'Make it work. In the real world.',
    copy: 'A useful product, a simpler process, or a new way to grow.',
  },
];

export function IdeaJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767px)',
        short: '(max-height: 600px)',
      },
      (mediaContext) => {
        if (!mediaContext.conditions?.motion || mediaContext.conditions.short)
          return;
        const mobile = mediaContext.conditions.mobile;
        const context = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: mobile ? '+=140%' : '+=200%',
              onUpdate: ({ progress }) =>
                setChapterIndex(progress < 0.38 ? 0 : progress < 0.82 ? 1 : 2),
              pin: '.journey-stage',
              pinSpacing: false,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .fromTo(
              '.journey-progress-fill',
              { scaleX: 0 },
              { scaleX: 1, duration: 2.2, ease: 'none' },
              0,
            )
            .to(
              '.journey-orbit',
              { rotation: 120, scale: 0.72, duration: 1 },
              0,
            )
            .fromTo(
              '.journey-piece',
              {
                x: (index) =>
                  Math.sin(index * 2.4) *
                  Math.min(120, window.innerWidth * 0.2),
                y: (index) =>
                  Math.cos(index * 2.4) *
                  Math.min(120, window.innerWidth * 0.2),
              },
              { x: 0, y: 0, stagger: 0.025, duration: 1 },
              0,
            )
            .to(
              '.journey-chapter-0',
              { autoAlpha: 0, y: -50, duration: 0.2 },
              0.65,
            )
            .fromTo(
              '.journey-chapter-1',
              { autoAlpha: 0, y: 50 },
              { autoAlpha: 1, y: 0, duration: 0.25 },
              0.85,
            )
            .to(
              '.journey-orbit',
              { rotation: 240, scale: 1.1, duration: 1 },
              1.2,
            )
            .to(
              '.journey-chapter-1',
              { autoAlpha: 0, y: -50, duration: 0.2 },
              1.65,
            )
            .fromTo(
              '.journey-chapter-2',
              { autoAlpha: 0, y: 50 },
              { autoAlpha: 1, y: 0, duration: 0.25 },
              1.85,
            );
        }, sectionRef);
        return () => context.revert();
      },
    );
    return () => media.revert();
  }, []);
  return (
    <section
      id="approach"
      className="idea-journey"
      ref={sectionRef}
      aria-label="How ideas take shape"
    >
      <div className="journey-stage">
        <div className="journey-progress" aria-label="Our process">
          <div className="journey-progress-labels">
            {chapters.map((chapter, index) => (
              <span
                key={chapter.name}
                aria-current={chapterIndex === index ? 'step' : undefined}
              >
                0{index + 1} / {chapter.name.replace('The ', '')}
              </span>
            ))}
          </div>
          <div className="journey-progress-track">
            <i className="journey-progress-fill" />
          </div>
        </div>
        <div className="journey-art" aria-hidden="true">
          <div className="journey-orbit">
            {Array.from({ length: 12 }, (_, index) => (
              <i
                key={index}
                className="journey-piece"
                style={{ '--piece': index } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
        <div className="journey-chapters">
          {chapters.map((chapter, index) => (
            <div
              className={`journey-chapter journey-chapter-${index}`}
              key={chapter.name}
            >
              <p className="eyebrow">{chapter.name}</p>
              <h2>{chapter.title}</h2>
              <p>{chapter.copy}</p>
            </div>
          ))}
        </div>
        <span className="journey-footnote" aria-hidden="true">
          Ideas take shape as you scroll.
        </span>
        <a className="journey-skip" href="#work">
          Explore the work ↓
        </a>
      </div>
    </section>
  );
}
