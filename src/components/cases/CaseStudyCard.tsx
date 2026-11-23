import type { CSSProperties } from 'react';
import type { CaseStudy } from '../../types/cases';
import { CASE_INTERVAL_MS } from '../../constants/cases';
import { useCaseCarousel } from '../../hooks/useCaseCarousel';
import { CaseVisual } from './CaseVisual';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const {
    elementRef,
    index,
    paused,
    playing,
    select,
    setHovered,
    setFocused,
    toggle,
  } = useCaseCarousel(study.phases.length);
  const phase = study.phases[index];
  return (
    <article
      ref={elementRef}
      className={`case-study case-${study.theme}`}
      aria-labelledby={`${study.id}-title`}
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="case-copy">
        <div>
          <p className="eyebrow">{study.category}</p>
          <h3 id={`${study.id}-title`}>{study.title}</h3>
          <span className="case-placeholder">Case study coming soon</span>
        </div>
        <div
          className="case-slide"
          key={index}
          data-phase={index}
          aria-live={playing ? 'off' : 'polite'}
        >
          <p className="eyebrow">{phase.label}</p>
          <h4>{phase.heading}</h4>
          <p>{phase.description}</p>
        </div>
        <div className="case-controls">
          <div
            className="case-tabs"
            role="group"
            aria-label={`${study.title} chapters`}
          >
            {study.phases.map((item, phaseIndex) => (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                aria-pressed={phaseIndex === index}
                onClick={() => select(phaseIndex)}
              >
                <span>{item.label}</span>
                <i
                  key={`${index}-${playing}`}
                  className={
                    phaseIndex === index && playing ? 'is-running' : ''
                  }
                  style={
                    { '--interval': `${CASE_INTERVAL_MS}ms` } as CSSProperties
                  }
                />
              </button>
            ))}
          </div>
          <button
            className="case-play"
            type="button"
            aria-label={`${paused ? 'Play' : 'Pause'} ${study.title}`}
            aria-pressed={paused}
            onClick={toggle}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
      </div>
      <CaseVisual study={study} phase={index} />
    </article>
  );
}
