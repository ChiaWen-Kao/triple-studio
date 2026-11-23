import { caseStudies } from '../../constants/cases';
import { useWorkReveal } from '../../hooks/useWorkReveal';
import { useProjectNavigation } from '../../hooks/useProjectNavigation';
import { ProjectDetail } from './ProjectDetail';
import { WorkTile } from './WorkTile';

export function CaseStudies() {
  const sectionRef = useWorkReveal();
  const { study, triggerRef, open, close, next } = useProjectNavigation();
  const nextStudy = study
    ? caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length]
    : caseStudies[0];
  return (
    <section
      id="work"
      className="work-gallery section"
      aria-labelledby="work-heading"
      ref={sectionRef}
    >
      <div className="work-gallery-intro">
        <h2 id="work-heading" className="work-gallery-heading" data-reveal>
          Featured Work
        </h2>
        <p>Ideas made useful. Three upcoming stories from our studio.</p>
      </div>
      <div className="work-grid">
        {caseStudies.map((project) => (
          <WorkTile key={project.id} study={project} onOpen={open} />
        ))}
      </div>
      <p className="work-gallery-note">
        Three upcoming case studies. Project names and results to follow.
      </p>
      {study && (
        <ProjectDetail
          study={study}
          nextStudy={nextStudy}
          onNext={() => next(nextStudy)}
          triggerRef={triggerRef}
          onClose={close}
        />
      )}
    </section>
  );
}
