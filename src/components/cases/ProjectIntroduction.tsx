import type { CaseStudy } from '../../types/cases';

export function ProjectIntroduction({
  study,
  onExplore,
}: {
  study: CaseStudy;
  onExplore: () => void;
}) {
  return (
    <div className="project-introduction">
      <div className="project-introduction-content">
        <h2 id="project-detail-title">{study.galleryTitle}</h2>
        <div className="project-summary">
          <div className="project-description">
            <p>{study.title}</p>
            <p>{study.phases[0].description}</p>
          </div>
          <dl>
            <div>
              <dt>Focus</dt>
              <dd>{study.category}</dd>
            </div>
            <div>
              <dt>Project</dt>
              <dd>Case study coming soon</dd>
            </div>
          </dl>
          <button className="project-explore" type="button" onClick={onExplore}>
            Explore the story <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
