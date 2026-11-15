import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { submitContactRequest } from '../api/contact';

type SubmissionState = 'idle' | 'pending' | 'success' | 'error';

export function useContactForm() {
  const [state, setState] = useState<SubmissionState>('idle');
  const pendingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (pendingRef.current || !form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get('_honey')) return;
    pendingRef.current = true;
    setState('pending');
    try {
      await submitContactRequest(data);
      form.reset();
      setState('success');
    } catch {
      setState('error');
    } finally {
      pendingRef.current = false;
    }
  }
  return { state, handleSubmit, isSubmitting: state === 'pending' };
}
