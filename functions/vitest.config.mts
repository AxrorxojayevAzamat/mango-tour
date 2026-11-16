// Unit tests for Cloudflare Pages Functions (Node environment, separate from `ng test`).
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: fileURLToPath(new URL('..', import.meta.url)),
  test: {
    include: ['functions/**/*.test.ts', 'scripts/**/*.test.mjs'],
    environment: 'node',
  },
});
