import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/wendava-studio/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    restoreMocks: true,
  },
});
