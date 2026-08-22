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

  for (const colorScheme of ['dark', 'light'] as const) {
    test(`meets WCAG AA color contrast in the ${colorScheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('/');

      const results = await new AxeBuilder({ page }).withRules('color-contrast').analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
