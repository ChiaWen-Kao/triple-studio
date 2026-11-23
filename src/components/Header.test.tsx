import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { Header } from './Header';

beforeEach(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.setAttribute('open', '');
      },
    },
    close: {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.removeAttribute('open');
        this.dispatchEvent(new Event('close'));
      },
    },
  });
});
afterEach(() => {
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});

it('locks background scrolling and restores focus when navigation closes', () => {
  render(<Header />);
  const toggle = screen.getByRole('button', { name: 'Open navigation' });
  fireEvent.click(toggle);
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.click(screen.getByRole('button', { name: 'Close navigation' }));
  expect(document.body.style.overflow).toBe('');
  expect(toggle).toHaveFocus();
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

it('closes the menu and restores page scrolling after choosing a destination', () => {
  render(<Header />);
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  const work = screen.getByRole('link', { name: /Selected work/ });
  expect(work).toHaveAttribute('href', '#work');
  fireEvent.click(work);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('');
});
