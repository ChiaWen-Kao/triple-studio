import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Contact } from './Contact';
import { submitContactRequest } from '../api/contact';

vi.mock('../api/contact', () => ({ submitContactRequest: vi.fn() }));
const submit = vi.mocked(submitContactRequest);
beforeEach(() => submit.mockReset());

async function fillRequest() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('I am'), 'Test visitor');
  await user.type(
    screen.getByLabelText('Reach me through email'),
    'visitor@example.com',
  );
  await user.click(screen.getByLabelText('Website'));
  await user.type(screen.getByLabelText('Content'), 'A website for our studio');
  return user;
}

describe('contact form', () => {
  it('blocks invalid fields before contacting the service', async () => {
    render(<Contact />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Request a chat' }),
    );
    expect(submit).not.toHaveBeenCalled();
  });

  it('locks inputs, prevents duplicate requests and resets only after success', async () => {
    let resolveRequest: () => void = () => {};
    submit.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const { container } = render(<Contact />);
    const user = await fillRequest();
    await user.click(screen.getByRole('button', { name: 'Request a chat' }));
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    expect(screen.getByLabelText('I am')).toBeDisabled();
    fireEvent.submit(container.querySelector('form')!);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit.mock.calls[0][0].get('project')).toBe('website');
    await act(async () => resolveRequest());
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your meeting time is not yet confirmed.',
    );
    expect(screen.getByLabelText('I am')).toHaveValue('');
    expect(screen.getByLabelText('Website')).not.toBeChecked();
  });

  it('keeps entries and allows retry when delivery is not confirmed', async () => {
    submit
      .mockRejectedValueOnce(new Error('Activation required'))
      .mockResolvedValueOnce();
    render(<Contact />);
    const user = await fillRequest();
    await user.click(screen.getByRole('button', { name: 'Request a chat' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'couldn’t confirm',
    );
    expect(screen.getByLabelText('I am')).toHaveValue('Test visitor');
    expect(screen.getByLabelText('Website')).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Request a chat' }));
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('submitted'),
    );
    expect(submit).toHaveBeenCalledTimes(2);
  });
});
