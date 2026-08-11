/**
 * Vitest config for the pure layers (domain/application).
 *
 * Separate from `ng test`: these layers have no Angular dependency, so they run
 * in node without template compilation - fast, and usable by Stryker.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/app/features/*/{domain,application}/**/*.spec.ts',
      'src/app/shared/kernel/**/*.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/app/features/*/{domain,application}/**/*.ts', 'src/app/shared/kernel/**/*.ts'],
      exclude: ['**/*.spec.ts', '**/index.ts'],
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 95,
        lines: 95,
      },
    },
  },
});
