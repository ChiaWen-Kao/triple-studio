import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitContactRequest } from './contact';
import { REQUEST_TIMEOUT_MS } from '../constants/contact';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('contact delivery confirmation', () => {
  it.each([true, 'true'])(
    'accepts an explicit %s success response',
    async (success) => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ success }) });
      vi.stubGlobal('fetch', fetchMock);
      const data = new FormData();
      data.set('email', 'visitor@example.com');
      await expect(submitContactRequest(data)).resolves.toBeUndefined();
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({ method: 'POST', body: data }),
      );
      expect(fetchMock.mock.calls[0][0].pathname).toMatch(/^\/ajax\//);
    },
  );

  it('rejects HTTP 200 when activation is required', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: 'false',
          message: 'Activation required',
        }),
      }),
    );
    await expect(submitContactRequest(new FormData())).rejects.toThrow(
      'not confirmed',
    );
  });

  it('rejects an unsuccessful HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(submitContactRequest(new FormData())).rejects.toThrow(
      'could not accept',
    );
  });

  it('times out without automatically retrying', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          options.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const result = expect(
      submitContactRequest(new FormData()),
    ).rejects.toMatchObject({ name: 'AbortError' });
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
    await result;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
