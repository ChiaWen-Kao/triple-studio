export function WorkflowVisual() {
  return (
    <div className="services__visual services__visual--ai" aria-hidden="true">
      <div className="services__workflow">
        <div className="services__workflow-bar">
          <i></i>
          <i></i>
          <i></i>
        </div>
        <div className="services__workflow-flow">
          <span className="services__workflow-node services__workflow-node--input">
            <span>Request</span>
            <i></i>
            <i></i>
          </span>
          <span className="services__workflow-link"></span>
          <span className="services__workflow-node services__workflow-node--ai">
            AI
          </span>
          <span className="services__workflow-link"></span>
          <span className="services__workflow-node services__workflow-node--output">
            <span>Result</span>
            <i></i>
            <i></i>
          </span>
        </div>
      </div>
    </div>
  );
}
