import {
  CONTACT_ACTION,
  CONTACT_EMAIL,
  CONTACT_SUBJECT,
} from '../constants/contact';
import { useContactForm } from '../hooks/useContactForm';

const projectOptions = [
  { value: 'web-app', label: 'Web App' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'website', label: 'Website' },
];

export function Contact() {
  const { state, isSubmitting, handleSubmit } = useContactForm();
  return (
    <section
      id="contact"
      className="section contact"
      aria-labelledby="contact-heading"
    >
      <div className="contact-copy">
        <h2 id="contact-heading" className="section-title">
          Tell us what you’re thinking
        </h2>
        <p>
          Share the rough idea. We’ll learn a little more and find a time to
          chat.
        </p>
      </div>
      <form
        className="contact-form"
        action={CONTACT_ACTION}
        method="post"
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
      >
        <input
          type="hidden"
          name="_subject"
          value={CONTACT_SUBJECT}
          disabled={isSubmitting}
        />
        <input
          type="hidden"
          name="_template"
          value="table"
          disabled={isSubmitting}
        />
        <input
          className="form-honeypot"
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          disabled={isSubmitting}
        />
        <div className="compose-header">New chat request</div>
        <div className="form-field">
          <label htmlFor="name">I am</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name or team"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Reach me through email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            disabled={isSubmitting}
          />
        </div>
        <div
          className="form-field project-field"
          role="radiogroup"
          aria-labelledby="project-label"
        >
          <div id="project-label" className="form-legend">
            I want to chat about ideas for my
          </div>
          <div className="project-options">
            {projectOptions.map(({ value, label }, index) => (
              <label key={value}>
                <input
                  type="radio"
                  name="project"
                  value={value}
                  required={index === 0}
                  disabled={isSubmitting}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={5}
            placeholder="The idea, where you’re at, and what you’d like help with."
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="compose-actions">
          <button
            className="button button-primary submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending…' : 'Request a chat'}
          </button>
          <p className="form-note">We'll be in touch soon to arrange a chat.</p>
        </div>
        <p
          className="form-status"
          role="status"
          aria-live="polite"
          hidden={state !== 'pending' && state !== 'success'}
        >
          {isSubmitting
            ? 'Sending your request…'
            : state === 'success'
              ? 'Your request has been submitted. We’ll email you to arrange a chat. Your meeting time is not yet confirmed.'
              : ''}
        </p>
        <p
          className="form-status form-status--error"
          role="alert"
          hidden={state !== 'error'}
        >
          {state === 'error'
            ? 'We couldn’t confirm your submission. Your details are still here. Please try again, or use the email link below.'
            : ''}
        </p>
        <p className="form-alternative">
          Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </form>
    </section>
  );
}
