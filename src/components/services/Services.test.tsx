import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Services } from './Services';

vi.mock('../../vendor/react-bits/ScrollReveal', () => ({
  default: ({ children, id }: { children: string; id: string }) => (
    <h2 id={id}>{children}</h2>
  ),
}));

it('shows all service descriptions and moves directly to the contact form without scrubbing the portal', () => {
  render(
    <>
      <Services />
      <section id="contact" tabIndex={-1}>
        Contact
      </section>
    </>,
  );
  expect(
    screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent),
  ).toEqual([
    'Bring an idea to life.',
    'Move an existing product forward.',
    'Make everyday work easier.',
  ]);
  expect(screen.getByText(/AI Automation · Workflow Automation/)).toBeVisible();
  const contact = document.getElementById('contact')!;
  const scroll = vi.fn();
  contact.scrollIntoView = scroll;
  fireEvent.click(screen.getByRole('link', { name: /Let’s talk/ }));
  expect(scroll).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
  expect(contact).toHaveFocus();
  expect(location.hash).toBe('#contact');
});
