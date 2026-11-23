import { StrictMode } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { CaseStudies } from './CaseStudies';

beforeEach(() => {
  window.history.replaceState(null, '', '/#work');
  HTMLElement.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      callback: IntersectionObserverCallback;
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }
      observe(target: Element) {
        this.callback(
          [{ target, isIntersecting: true } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      unobserve() {}
      disconnect() {}
    },
  );
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
      },
    },
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});

it('opens a project from its tile and restores the same tile after returning', async () => {
  render(<CaseStudies />);
  const tile = screen.getByRole('link', { name: 'Explore Product idea' });
  fireEvent.click(tile);
  expect(window.location.hash).toBe('#work/product');
  expect(screen.getByRole('dialog', { name: 'Product idea' })).toBeVisible();
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  );
  expect(window.location.hash).toBe('#work');
  expect(document.body.style.overflow).toBe('');
  expect(tile).toHaveFocus();
});

it('keeps the three text and animation chapters together inside the detail', () => {
  render(<CaseStudies />);
  fireEvent.click(screen.getByRole('link', { name: 'Explore Product idea' }));
  const study = screen.getByRole('article');
  fireEvent.click(within(study).getByRole('button', { name: 'The outcome' }));
  expect(
    within(study).getByRole('heading', { name: 'Show what changed.' }),
  ).toBeVisible();
  expect(within(study).getByRole('img')).toHaveAttribute('data-phase', '1');
});

it('opens the next project without accumulating history entries and resets its chapters', () => {
  render(<CaseStudies />);
  fireEvent.click(screen.getByRole('link', { name: 'Explore Product idea' }));
  fireEvent.click(screen.getByRole('button', { name: 'The outcome' }));
  const historyLength = window.history.length;
  fireEvent.click(
    screen.getByRole('button', { name: 'Next project: Connected workflows' }),
  );
  expect(window.location.hash).toBe('#work/operations');
  expect(window.history.length).toBe(historyLength);
  expect(
    screen.getByRole('dialog', { name: 'Connected workflows' }),
  ).toBeVisible();
  expect(within(screen.getByRole('article')).getByRole('img')).toHaveAttribute(
    'data-phase',
    '0',
  );
});

it('opens direct project links and lets Escape return to the gallery', async () => {
  window.history.replaceState(null, '', '/#work/experience');
  render(<CaseStudies />);
  const dialog = screen.getByRole('dialog', { name: 'Digital experience' });
  fireEvent(dialog, new Event('cancel', { cancelable: true }));
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  );
  expect(window.location.hash).toBe('#work');
  await waitFor(() =>
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'instant',
    }),
  );
});

it('closes project details when browser history changes back to the gallery', () => {
  render(<CaseStudies />);
  fireEvent.click(screen.getByRole('link', { name: 'Explore Product idea' }));
  act(() => {
    window.history.replaceState(null, '', '/#work');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('');
});

it('reveals project copy after the entrance animation under Strict Mode', async () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    width: 600,
    height: 390,
    left: 0,
    top: 0,
    right: 600,
    bottom: 390,
    toJSON() {},
  });
  render(
    <StrictMode>
      <CaseStudies />
    </StrictMode>,
  );
  fireEvent.click(screen.getByRole('link', { name: 'Explore Product idea' }));
  const introduction = screen
    .getByRole('heading', { name: 'Product idea', level: 2 })
    .closest('.project-introduction');
  await waitFor(() => expect(introduction).toHaveStyle({ opacity: '1' }), {
    timeout: 2500,
  });
});

it('finishes the next-project transition and leaves the new project interactive', async () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: !query.includes('reduced'),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  render(<CaseStudies />);
  fireEvent.click(screen.getByRole('link', { name: 'Explore Product idea' }));
  fireEvent.click(
    screen.getByRole('button', { name: 'Next project: Connected workflows' }),
  );
  expect(screen.getByRole('dialog')).toHaveAttribute(
    'data-transitioning',
    'true',
  );
  await waitFor(
    () => {
      expect(
        screen.getByRole('dialog', { name: 'Connected workflows' }),
      ).toHaveAttribute('data-transitioning', 'false');
    },
    { timeout: 2500 },
  );
  expect(window.location.hash).toBe('#work/operations');
  fireEvent.click(screen.getByRole('button', { name: 'The outcome' }));
  expect(within(screen.getByRole('article')).getByRole('img')).toHaveAttribute(
    'data-phase',
    '1',
  );
});

it('fades back to the originating tile without losing focus or leaving scroll locked', async () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: !query.includes('reduced'),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  render(<CaseStudies />);
  const tile = screen.getByRole('link', { name: 'Explore Product idea' });
  fireEvent.click(tile);
  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
  expect(document.body.style.overflow).toBe('hidden');
  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 1500 },
  );
  expect(tile).toHaveFocus();
  expect(document.body.style.overflow).toBe('');
  expect(window.location.hash).toBe('#work');
});
