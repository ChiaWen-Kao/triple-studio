export function RedesignVisual() {
  return (
    <div
      className="services__visual services__visual--redesign"
      aria-hidden="true"
    >
      <div className="services__compare">
        <div className="services__compare-old">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="services__compare-new">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="services__compare-mark">↗</span>
      </div>
      <div className="services__launch-board">
        <div className="services__launch-board-bar">
          <span className="services__launch-board-dots">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>Release check</span>
        </div>
        <div className="services__launch-board-content">
          <div className="services__launch-checklist">
            <div className="services__launch-check-item">
              <span className="services__launch-check">
                <i></i>
              </span>
              <span>Test</span>
              <i className="services__launch-check-line"></i>
            </div>
            <div className="services__launch-check-item">
              <span className="services__launch-check">
                <i></i>
              </span>
              <span>Launch</span>
              <i className="services__launch-check-line"></i>
            </div>
            <div className="services__launch-check-item">
              <span className="services__launch-check">
                <i></i>
              </span>
              <span>Support</span>
              <i className="services__launch-check-line"></i>
            </div>
          </div>
          <div className="services__launch-status">
            <span className="services__launch-live">
              <i></i>Live
            </span>
            <span className="services__launch-arrow" aria-hidden="true">
              ↗
            </span>
            <span className="services__launch-status-line"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
