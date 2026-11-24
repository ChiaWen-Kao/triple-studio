import { useRef } from 'react';
import { journeyChapters } from '../../constants/journey';
import { useJourneyMotion } from '../../hooks/useJourneyMotion';

export function IdeaJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const chapterIndex = useJourneyMotion(sectionRef);
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
            {journeyChapters.map((chapter, index) => (
              <span
                key={chapter.name}
                aria-current={chapterIndex === index ? 'step' : undefined}
              >
                0{index + 1} / {chapter.name}
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
          {journeyChapters.map((chapter, index) => (
            <div
              className={`journey-chapter journey-chapter-${index}`}
              key={chapter.name}
            >
              <p className="eyebrow">{chapter.name}</p>
              <h3>{chapter.title}</h3>
              <p>{chapter.copy}</p>
            </div>
          ))}
        </div>
        <a className="pill pill-dark section-cta journey-skip" href="#work">
          Explore the work <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
