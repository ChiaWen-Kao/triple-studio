import { CONTACT_ACTION, REQUEST_TIMEOUT_MS } from '../constants/contact';

export async function submitContactRequest(formData: FormData): Promise<void> {
  const endpoint = new URL(CONTACT_ACTION);
  endpoint.pathname = `/ajax${endpoint.pathname}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error('The form service could not accept this request.');
    const result: { success?: boolean | string } = await response.json();
    if (result.success !== true && result.success !== 'true') {
      throw new Error('The form service has not confirmed this request.');
    }
  } finally {
    clearTimeout(timeout);
  }
}
