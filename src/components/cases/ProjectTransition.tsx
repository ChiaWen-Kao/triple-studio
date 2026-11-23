import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { CaseStudy } from '../../types/cases';
import { CaseVisual } from './CaseVisual';

export interface ProjectTransitionRequest {
  study: CaseStudy;
  bounds: DOMRect;
  onArrive: () => void;
}

export function ProjectTransition({
  request,
  onComplete,
}: {
  request: ProjectTransitionRequest;
  onComplete: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const context = gsap.context(() => {
      gsap
        .timeline({ onComplete })
        .fromTo(
          overlay,
          {
            x: request.bounds.x,
            y: request.bounds.y,
            width: request.bounds.width,
            height: request.bounds.height,
          },
          {
            x: 0,
            y: 0,
            width: innerWidth,
            height: innerHeight,
            duration: 0.85,
            ease: 'power3.inOut',
          },
        )
        .call(request.onArrive)
        .to(overlay, { opacity: 0, duration: 0.4, delay: 0.1 });
    });
    return () => context.revert();
  }, [request, onComplete]);
  return (
    <div className="project-transition" ref={overlayRef} aria-hidden="true">
      <div className="project-next-preview">
        <CaseVisual study={request.study} phase={1} />
      </div>
      <span className="project-next-title">{request.study.galleryTitle}</span>
    </div>
  );
}
