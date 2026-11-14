export function MobileVisual() {
  return (
    <div
      className="services__visual services__visual--mobile"
      aria-hidden="true"
    >
      <div className="services__phone">
        <div className="services__phone-screen">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="services__code-editor">
        <div className="services__code-editor-bar">
          <span className="services__code-editor-dots">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>app.js</span>
        </div>
        <pre className="services__code-sample">
          <code>
            <span className="services__code-keyword">const</span>
            {' app = {\n  build() {\n    '}
            <span className="services__code-keyword">return</span>{' '}
            <span className="services__code-string">"ready"</span>
            {';\n  }\n};'}
          </code>
        </pre>
      </div>
    </div>
  );
}
