import { expect, test } from '@playwright/test';

const FRAGMENTS = ['about', 'experience', 'work', 'stack', 'contact'] as const;

test.describe('header navigation', () => {
  test('fragment links scroll their section into the viewport', async ({ page }) => {
    await page.goto('/');

    for (const fragment of FRAGMENTS) {
      const label = fragment.charAt(0).toUpperCase() + fragment.slice(1);
      await page.locator('.links').getByRole('link', { exact: true, name: label }).click();
      await expect(page).toHaveURL(new RegExp(`#${fragment}$`));
      await expect(page.locator(`#${fragment}`)).toBeInViewport();
    }
  });

  test('certificates link is marked active only on its page', async ({ page }) => {
    await page.goto('/');

    const link = page.locator('.links').getByRole('link', { name: 'Certificates' });
    await expect(link).not.toHaveClass(/link-active/);

    await link.click();
    await expect(page).toHaveURL(/\/certificates$/);
    await expect(link).toHaveClass(/link-active/);
    await expect(page.locator('.page-title')).toHaveText('Certificates');
  });

  test('brand link returns from certificates to the landing', async ({ page }) => {
    await page.goto('/certificates');

    await page.locator('a.brand').click();
    await expect(page).toHaveURL(/:\d+\/$/);
    await expect(page.locator('.hero')).toBeInViewport();
  });

  test('fragment link from certificates routes back to the landing section', async ({ page }) => {
    await page.goto('/certificates');

    await page.locator('.links').getByRole('link', { exact: true, name: 'Stack' }).click();
    await expect(page).toHaveURL(/\/#stack$/);
    await expect(page.locator('#stack')).toBeInViewport();
  });
});
