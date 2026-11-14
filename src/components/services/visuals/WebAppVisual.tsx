export function WebAppVisual() {
  return (
    <div
      className="services__visual services__visual--web-app"
      aria-hidden="true"
    >
      <div className="services__board">
        <div className="services__board-side">
          <span className="services__line"></span>
          <span className="services__line"></span>
          <span className="services__line"></span>
        </div>
        <div className="services__board-main">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="services__whiteboard">
        <div className="services__whiteboard-flow">
          <div className="services__wireframe services__wireframe--home">
            <span className="services__wireframe-nav">
              <i></i>
              <i></i>
            </span>
            <span className="services__wireframe-media"></span>
            <span className="services__wireframe-line"></span>
            <span className="services__wireframe-line services__wireframe-line--short"></span>
            <span className="services__wireframe-button"></span>
          </div>
          <span className="services__whiteboard-link services__whiteboard-link--forward-left"></span>
          <div className="services__wireframe services__wireframe--search">
            <span className="services__wireframe-nav">
              <i></i>
              <i></i>
            </span>
            <span className="services__wireframe-search"></span>
            <span className="services__wireframe-result">
              <i></i>
              <span className="services__wireframe-line"></span>
            </span>
            <span className="services__wireframe-result">
              <i></i>
              <span className="services__wireframe-line services__wireframe-line--short"></span>
            </span>
            <span className="services__wireframe-result">
              <i></i>
              <span className="services__wireframe-line"></span>
            </span>
          </div>
          <span className="services__whiteboard-link services__whiteboard-link--forward-right"></span>
          <div className="services__wireframe services__wireframe--detail">
            <span className="services__wireframe-nav">
              <i></i>
              <i></i>
            </span>
            <span className="services__wireframe-product">
              <i className="services__wireframe-product-image"></i>
              <span className="services__wireframe-product-copy">
                <i className="services__wireframe-line"></i>
                <i className="services__wireframe-line services__wireframe-line--short"></i>
              </span>
            </span>
            <span className="services__wireframe-line services__wireframe-line--short"></span>
            <span className="services__wireframe-button"></span>
          </div>
          <span className="services__whiteboard-link services__whiteboard-link--down"></span>
          <div className="services__wireframe services__wireframe--form">
            <span className="services__wireframe-nav">
              <i></i>
              <i></i>
            </span>
            <span className="services__wireframe-label"></span>
            <span className="services__wireframe-input"></span>
            <span className="services__wireframe-label services__wireframe-label--short"></span>
            <span className="services__wireframe-input"></span>
            <span className="services__wireframe-button"></span>
          </div>
          <span className="services__whiteboard-link services__whiteboard-link--back-right"></span>
          <div className="services__wireframe services__wireframe--confirm">
            <span className="services__wireframe-nav">
              <i></i>
              <i></i>
            </span>
            <span className="services__wireframe-check"></span>
            <span className="services__wireframe-line"></span>
            <span className="services__wireframe-line services__wireframe-line--short"></span>
            <span className="services__wireframe-button"></span>
          </div>
          <span className="services__whiteboard-link services__whiteboard-link--back-left"></span>
          <div className="services__wireframe services__wireframe--dashboard">
            <span className="services__wireframe-nav">
              <i></i>
              <i></i>
            </span>
            <span className="services__wireframe-metrics">
              <i></i>
              <i></i>
            </span>
            <span className="services__wireframe-chart">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </span>
            <span className="services__wireframe-line"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
