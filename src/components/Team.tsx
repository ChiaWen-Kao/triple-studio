const people = [
  { name: 'Wen Kao', role: 'Product Designer', initials: 'WK' },
  { name: 'Peter Wei', role: 'PM & Full-Stack Engineer', initials: 'PW' },
  { name: 'Daniel Wang', role: 'Full-Stack Engineer', initials: 'DW' },
];
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
        {people.map((person) => (
          <article className="person" key={person.name}>
            <div
              className="person-placeholder"
              role="img"
              aria-label={`Portrait placeholder for ${person.name}`}
            >
              <span aria-hidden="true">{person.initials}</span>
              <small>Portrait coming soon</small>
            </div>
            <h3>{person.name}</h3>
            <p>{person.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
