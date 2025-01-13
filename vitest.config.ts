import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // migration from jest
    globals: true,
    include: ['test/**/*-test.js'],
    coverage: {
      provider: 'v8',
      enabled: true,
      thresholds: {
        lines: 86,
        functions: 91,
        branches: 82,
        statements: 86,
      },
    },
  },
});
