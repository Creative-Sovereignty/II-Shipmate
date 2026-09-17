import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/utils/complianceTests.ts'],
  },
});
