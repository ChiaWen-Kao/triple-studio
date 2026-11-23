import { team } from '../constants/team';
import { Mascot } from './Mascot';

export function Team() {
  return (
    <section
      id="studio"
      className="section studio-team"
      aria-labelledby="team-heading"
    >
      <div className="team-intro">
        <p className="eyebrow">The people behind the thinking</p>
        <h2 id="team-heading">
          Different skills.
          <br />
          Shared curiosity.
        </h2>
        <p>
          Design, business thinking and development.
          <br />
          Working together from the first conversation.
        </p>
      </div>
      <div className="people-grid">
        {team.map((person) => (
          <article className="person" key={person.name}>
            <div className={`person-portrait person-portrait--${person.id}`}>
              <Mascot
                sprite={person.sprite}
                name={`${person.name}, Wendava pixel character`}
              />
            </div>
            <h3>{person.name}</h3>
            <p>{person.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
