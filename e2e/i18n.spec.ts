import { expect, test } from '@playwright/test';

test.describe('locale switch', () => {
  test('switching to russian re-renders chrome, plurals and dates', async ({ page }) => {
    await page.goto('/');

    const enButton = page.getByRole('button', { exact: true, name: 'en' });
    const ruButton = page.getByRole('button', { exact: true, name: 'ru' });

    // English is the default locale.
    await expect(enButton).toHaveAttribute('aria-pressed', 'true');
    await expect(enButton).toHaveClass(/locale-active/);
    await expect(ruButton).toHaveAttribute('aria-pressed', 'false');
    await expect(ruButton).not.toHaveClass(/locale-active/);

    await ruButton.click();
    await expect(ruButton).toHaveAttribute('aria-pressed', 'true');
    await expect(ruButton).toHaveClass(/locale-active/);
    await expect(enButton).toHaveAttribute('aria-pressed', 'false');
    await expect(enButton).not.toHaveClass(/locale-active/);

    // Chrome strings switch to russian.
    await expect(page.locator('.links')).toContainText('Обо мне');
    await expect(page.locator('a.brand')).toContainText('Портфолио');
    await expect(page.locator('a.cta-primary')).toContainText('Выбранные проекты');
    await expect(page.locator('footer')).toContainText('Данил Ковалёв');

    // ICU plurals pick the russian few/many branches.
    const experienceLine = page.locator('.hero .experience');
    await expect(experienceLine).toContainText('производственного опыта');
    await expect(experienceLine).toContainText(/(год|года|лет)/);
    await expect(page.locator('#experience')).toContainText('сейчас');

    // Certificate dates use russian month names. Client-side navigation keeps
    // the in-memory locale (a full reload would reset it to english).
    await page.locator('.links').getByRole('link', { name: 'Сертификаты' }).click();
    await expect(page.locator('.page-title')).toHaveText('Сертификаты');
    await expect(page.locator('.card-meta').first()).toContainText('апрель 2025');

    // Switching back restores english.
    await enButton.click();
    await expect(page.locator('.page-title')).toHaveText('Certificates');
    await expect(page.locator('.card-meta').first()).toContainText('April 2025');
  });
});
