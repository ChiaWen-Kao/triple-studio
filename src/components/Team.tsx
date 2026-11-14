export function Team() {
  return (
    <section id="team" className="section team" aria-labelledby="team-heading">
      <div className="section-heading team-heading">
        <h2 id="team-heading" className="section-title">
          People who make it happen
        </h2>
        <p>
          Strategy, design and development stay connected from the first
          conversation to launch.
        </p>
      </div>

      <div className="team-grid">
        <article className="team-member">
          <div
            className="portrait-placeholder"
            role="img"
            aria-label="Portrait placeholder for team member two"
          >
            <span>Portrait placeholder</span>
          </div>
          <div>
            <h3>Peter Wei</h3>
            <p className="team-role">PM &amp; Full-Stack Engineer</p>
          </div>
        </article>
        <article className="team-member">
          <div
            className="portrait-placeholder"
            role="img"
            aria-label="Portrait placeholder for team member three"
          >
            <span>Portrait placeholder</span>
          </div>
          <div>
            <h3>Daniel Wang</h3>
            <p className="team-role">Full-Stack Engineer</p>
          </div>
        </article>
        <article className="team-member">
          <div
            className="portrait-placeholder"
            role="img"
            aria-label="Portrait placeholder for team member one"
          >
            <span>Portrait placeholder</span>
          </div>
          <div>
            <h3>Wen Kao</h3>
            <p className="team-role">Product Designer</p>
          </div>
        </article>
      </div>
    </section>
  );
}
