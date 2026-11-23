import type { CSSProperties, MouseEvent } from 'react';
import type { CaseStudy } from '../../types/cases';
import { CaseVisual } from './CaseVisual';

export function WorkTile({
  study,
  onOpen,
}: {
  study: CaseStudy;
  onOpen: (study: CaseStudy, trigger: HTMLAnchorElement) => void;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    onOpen(study, event.currentTarget);
  };
  return (
    <a
      className="work-tile"
      href={`#work/${study.id}`}
      onClick={handleClick}
      aria-label={`Explore ${study.galleryTitle}`}
      data-reveal
    >
      <div className="work-tile-media" aria-hidden="true">
        <CaseVisual study={study} phase={1} />
      </div>
      <p className="work-tile-category">{study.category}</p>
      <h3 className="work-tile-title" aria-label={study.galleryTitle}>
        <span className="work-tile-arrow" aria-hidden="true">
          →
        </span>
        <span className="work-tile-name" aria-hidden="true">
          {Array.from(study.galleryTitle).map((letter, index) => (
            <span className="work-letter" key={index}>
              <span style={{ '--letter-index': index } as CSSProperties}>
                {[0, 1, 2, 3].map((copy) => (
                  <span key={copy}>{letter === ' ' ? '\u00a0' : letter}</span>
                ))}
              </span>
            </span>
          ))}
        </span>
      </h3>
    </a>
  );
}
