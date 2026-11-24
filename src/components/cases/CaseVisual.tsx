import type { CaseStudy } from '../../types/cases';

export function CaseVisual({
  study,
  phase,
}: {
  study: CaseStudy;
  phase: number;
}) {
  return (
    <div
      className={`case-visual visual-${study.theme} phase-${phase}`}
      role="img"
      aria-label={study.phases[phase].visualLabel}
      data-phase={phase}
    >
      <span className="visual-corner">W / IN PRACTICE</span>
      {study.theme === 'product' && (
        <div className="product-composition" aria-hidden="true">
          <div className="idea-note note-one">What if?</div>
          <div className="idea-note note-two">For whom?</div>
          <div className="product-device">
            <div className="device-camera" />
            <div className="device-greeting">
              A little
              <br />
              more possible.
            </div>
            <div className="device-preview" />
            <div className="device-row">
              <i />
              <i />
              <i />
            </div>
            <div className="device-action">Let’s begin</div>
          </div>
          <div className="feedback-note">Make it simpler.</div>
        </div>
      )}
      {study.theme === 'operations' && (
        <div className="workflow-composition" aria-hidden="true">
          <svg viewBox="0 0 500 400">
            <path
              className="workflow-path"
              d="M80 100 C250 100 50 200 250 200 S250 300 420 300"
            />
          </svg>
          <div className="workflow-node node-in">
            A request<span>↓</span>
          </div>
          <div className="workflow-node node-center">
            {phase === 2 ? 'Human review' : 'One clear place'}
          </div>
          <div className="workflow-node node-out">
            Next step<span>✓</span>
          </div>
          <div className="workflow-packet" />
        </div>
      )}
      {study.theme === 'experience' && (
        <div className="web-composition" aria-hidden="true">
          <div className="web-window">
            <div className="web-toolbar">
              <i />
              <i />
              <i />
              <span>your next chapter</span>
            </div>
            <div className="web-layout">
              <span className="web-kicker">A FRESH PERSPECTIVE</span>
              <strong>
                Good things.
                <br />
                Made clear.
              </strong>
              <span className="web-action">Discover more</span>
            </div>
          </div>
          <span className="web-feedback">A clearer next step.</span>
        </div>
      )}
      <span className="visual-caption">{study.phases[phase].visualLabel}</span>
    </div>
  );
}
