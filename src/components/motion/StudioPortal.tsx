import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export function StudioPortal() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      let cancelled = false;
      let cleanup: (() => void) | undefined;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          import('../../graphics/createJourneyTunnel')
            .then(({ createJourneyTunnel }) => {
              if (cancelled || !canvasRef.current) return;
              const scene = createJourneyTunnel(canvasRef.current);
              const context = gsap.context(() => {
                const progress = { value: 0 };
                const timeline = gsap.timeline({
                  scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300%',
                    pin: '.portal-stage',
                    pinSpacing: false,
                    scrub: 0.65,
                    invalidateOnRefresh: true,
                  },
                });
                timeline
                  .fromTo(
                    '.portal-frame',
                    {
                      scale: 0.76,
                      rotationY: -14,
                      rotationZ: -6,
                      borderRadius: '24px',
                    },
                    {
                      scale: 1,
                      rotationY: 0,
                      rotationZ: 0,
                      borderRadius: '0px',
                      duration: 0.6,
                    },
                  )
                  .to(
                    '.portal-intro',
                    { autoAlpha: 0, scale: 1.5, y: -100, duration: 0.4 },
                    0,
                  )
                  .to(
                    progress,
                    {
                      value: 1,
                      duration: 2.2,
                      ease: 'none',
                      onUpdate: () => scene.setProgress(progress.value),
                    },
                    0.3,
                  )
                  .fromTo(
                    '.portal-outro',
                    { autoAlpha: 0, scale: 0.8 },
                    { autoAlpha: 1, scale: 1, duration: 0.45 },
                    2,
                  )
                  .to('.portal-frame', { opacity: 0.25, duration: 0.5 }, 2.05);
              }, sectionRef);
              cleanup = () => {
                context.revert();
                scene.dispose();
              };
              ScrollTrigger.refresh();
            })
            .catch(() => {
              sectionRef.current?.classList.add('portal-unavailable');
            });
        },
        { rootMargin: '1000px' },
      );
      if (sectionRef.current) observer.observe(sectionRef.current);
      return () => {
        cancelled = true;
        observer.disconnect();
        cleanup?.();
      };
    });
    return () => media.revert();
  }, []);
  return (
    <section
      id="possibility"
      ref={sectionRef}
      className="studio-portal"
      aria-label="Explore what is possible"
    >
      <div className="portal-stage">
        <div className="portal-intro">
          <p className="eyebrow">A different perspective changes everything.</p>
          <h2>
            Step into
            <br />
            what’s possible.
          </h2>
        </div>
        <div className="portal-frame">
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
        <div className="portal-outro">
          <p className="eyebrow">Your next chapter starts here.</p>
          <h2>
            Let’s make
            <br />
            it happen.
          </h2>
          <a className="pill" href="#contact">
            Tell us your idea
          </a>
        </div>
      </div>
    </section>
  );
}
