import { useCallback, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { CaseStudy } from '../../types/cases';
import { useProjectDialog } from '../../hooks/useProjectDialog';
import { useProjectRail } from '../../hooks/useProjectRail';
import { CaseStudyCard } from './CaseStudyCard';
import { CaseVisual } from './CaseVisual';
import { ProjectIntroduction } from './ProjectIntroduction';
import { ProjectTransition } from './ProjectTransition';
import type { ProjectTransitionRequest } from './ProjectTransition';

export function ProjectDetail({
  study,
  nextStudy,
  triggerRef,
  onClose,
  onNext,
}: {
  study: CaseStudy;
  nextStudy: CaseStudy;
  triggerRef: RefObject<HTMLAnchorElement | null>;
  onClose: () => void;
  onNext: () => void;
}) {
  const { dialogRef, heroRef, close, closing } = useProjectDialog(
    triggerRef,
    onClose,
  );
  const storyRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [transition, setTransition] = useState<ProjectTransitionRequest | null>(
    null,
  );
  const finishTransition = useCallback(() => setTransition(null), []);
  const advanceProject = useCallback(() => {
    const preview = nextRef.current;
    if (
      !preview ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      onNext();
      return;
    }
    setTransition({
      study: nextStudy,
      bounds: preview.getBoundingClientRect(),
      onArrive: onNext,
    });
  }, [nextStudy, onNext]);
  const railRef = useProjectRail(study.id, advanceProject);
  const returnToWork = () => {
    setTransition(null);
    close();
  };
  const explore = () => {
    const rail = railRef.current;
    const story = storyRef.current;
    if (!rail || !story) return;
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    const target = desktop
      ? story.offsetLeft - innerWidth * 0.05
      : story.offsetTop - 88;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    rail.scrollTo({
      [desktop ? 'left' : 'top']: target,
      behavior: reduced ? 'instant' : 'smooth',
    });
  };
  return (
    <dialog
      className="project-detail"
      ref={dialogRef}
      aria-labelledby="project-detail-title"
      data-transitioning={Boolean(transition) || closing}
      onCancel={(event) => {
        event.preventDefault();
        returnToWork();
      }}
    >
      <header className="project-header">
        <span className="project-brand">
          wendava<small>STUDIO</small>
        </span>
        <button
          className="project-back"
          type="button"
          onClick={returnToWork}
          disabled={closing}
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <span className="project-header-label">Selected work</span>
      </header>
      <div
        className="project-rail"
        ref={railRef}
        tabIndex={0}
        aria-label="Project story"
      >
        <div className="project-track">
          <ProjectIntroduction study={study} onExplore={explore} />
          <div className="project-hero-media" ref={heroRef} aria-hidden="true">
            <CaseVisual study={study} phase={1} />
          </div>
          <div className="project-story-panel" ref={storyRef}>
            <CaseStudyCard key={study.id} study={study} />
          </div>
          <button
            className="project-next"
            type="button"
            onClick={advanceProject}
            disabled={Boolean(transition) || closing}
            ref={nextRef}
            aria-label={`Next project: ${nextStudy.galleryTitle}`}
          >
            <div className="project-next-preview" aria-hidden="true">
              <CaseVisual study={nextStudy} phase={1} />
            </div>
            <span className="project-next-title">{nextStudy.galleryTitle}</span>
            <span className="project-next-label">
              Next project <span className="project-next-line" />
              <span aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      </div>
      {transition && (
        <ProjectTransition request={transition} onComplete={finishTransition} />
      )}
      <span className="project-scroll-cue" aria-hidden="true">
        Scroll to explore <span>→</span>
      </span>
    </dialog>
  );
}
