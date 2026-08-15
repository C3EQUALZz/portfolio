/**
 * Vitest config for the pure layers (domain/application) plus the typed content
 * in infrastructure/content, which is framework-free data and its mapper.
 *
 * Separate from `ng test`: these modules have no Angular dependency, so they run
 * in node without template compilation - fast, and usable by Stryker.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/app/features/*/{domain,application}/**/*.spec.ts',
      'src/app/features/*/infrastructure/content/**/*.spec.ts',
      'src/app/shared/kernel/**/*.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'src/app/features/*/{domain,application}/**/*.ts',
        'src/app/features/*/infrastructure/content/**/*.ts',
        'src/app/shared/kernel/**/*.ts',
      ],
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
