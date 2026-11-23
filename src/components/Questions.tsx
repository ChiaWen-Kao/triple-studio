import questions from '../constants/questions.json';

export function Questions() {
  return (
    <section
      id="questions"
      className="section studio-questions"
      aria-labelledby="questions-heading"
    >
      <div>
        <p className="eyebrow">A few useful answers</p>
        <h2 id="questions-heading">
          Before
          <br />
          we begin.
        </h2>
      </div>
      <div>
        {questions.map((item) => (
          <details key={item.question}>
            <summary>
              {item.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
