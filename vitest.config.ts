import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/utils/**', 'src/i18n/**'],
    },
  },
  resolve: {
    alias: {
      '@utils': '/src/utils',
      '@i18n': '/src/i18n',
    },
  },
});
