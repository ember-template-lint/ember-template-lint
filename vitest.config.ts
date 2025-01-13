import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // migration from jest
    globals: true,
  },
})
