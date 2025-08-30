import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts'],
    reporters: 'default',
    setupFiles: ['tests/setup.ts'],
  },
});
