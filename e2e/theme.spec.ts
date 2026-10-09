import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('theme', () => {
  test('toggle switches data-theme and the choice survives reload', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const initial = await html.getAttribute('data-theme');
    const toggled = initial === 'dark' ? 'light' : 'dark';

    await page.getByRole('button', { name: /theme/i }).click();
    await expect(html).toHaveAttribute('data-theme', toggled);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', toggled);
  });

  for (const path of ['/', '/#experience']) {
    test(`theme toggles preserve the reading position on ${path}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto(path);
      await expect(page.locator('#experience .role')).toHaveCount(3);
      await page.waitForLoadState('networkidle');
      if (path.includes('#')) {
        await expect(page.locator('#experience')).toBeInViewport();
      }

      // Move manually, preserving any fragment in the address.
      const readingPosition = path.includes('#') ? 0 : 400;
      await page.evaluate((top) => {
        window.scrollTo({ top, behavior: 'instant' });
      }, readingPosition);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(readingPosition);

      for (const theme of ['light', 'dark']) {
        await page.locator('.theme-toggle').click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        // Wait for the render triggered by the theme signal, then observe scroll
        // over its CSS transition so a delayed jump cannot escape the assertion.
        const positions = await page.evaluate(async () => {
          const samples: number[] = [];
          const until = performance.now() + 400;
          while (performance.now() < until) {
            await new Promise<void>((resolve) =>
              requestAnimationFrame(() => {
                resolve();
              }),
            );
            samples.push(window.scrollY);
          }
          return samples;
        });
        const drift = positions.map((position) => Math.abs(position - readingPosition));
        expect(Math.max(...drift)).toBeLessThanOrEqual(1);
      }
    });
  }

  for (const colorScheme of ['dark', 'light'] as const) {
    test(`meets WCAG AA color contrast in the ${colorScheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('/');

      const results = await new AxeBuilder({ page }).withRules('color-contrast').analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
