import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export function StudioIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.intro-line > span', {
          yPercent: 110,
          rotation: 3,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 25%',
            scrub: 0.7,
          },
        });
        gsap.from('.intro-description', {
          opacity: 0.25,
          y: 35,
          scrollTrigger: {
            trigger: '.intro-description',
            start: 'top 95%',
            end: 'top 65%',
            scrub: 0.6,
          },
        });
      }, sectionRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return (
    <section className="studio-intro section" ref={sectionRef}>
      <h2>
        <span className="intro-line">
          <span>Good questions.</span>
        </span>
        <span className="intro-line">
          <span>Better possibilities.</span>
        </span>
      </h2>
      <div className="intro-description">
        <p>
          You don’t need to know what to build.
          <br />
          You just need something worth solving.
        </p>
        <a className="pill pill-dark" href="#services">
          Explore what we do
        </a>
      </div>
    </section>
  );
}
