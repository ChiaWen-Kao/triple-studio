import { caseStudies } from '../../constants/cases';
import { CaseStudyCard } from './CaseStudyCard';

export function CaseStudies() {
  return (
    <section
      id="work"
      className="case-studies section"
      aria-labelledby="work-heading"
    >
      <div className="work-heading">
        <h2 id="work-heading">
          Ideas.
          <br />
          Into action.
        </h2>
        <p>
          Three spaces for the stories behind our work.
          <br />
          Real projects and results will follow.
        </p>
      </div>
      <div className="case-list">
        {caseStudies.map((study) => (
          <CaseStudyCard study={study} key={study.id} />
        ))}
      </div>
    </section>
  );
}
