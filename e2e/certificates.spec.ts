import { expect, test } from '@playwright/test';

test.describe('certificates page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/certificates');
  });

  test('renders the grouped cards', async ({ page }) => {
    await expect(page.locator('.page-title')).toHaveText('Certificates');
    await expect(page.locator('.block-title')).toHaveText([
      'Professional certifications',
      'Courses',
      'Hackathons',
    ]);
    await expect(page.locator('.cards li')).toHaveCount(10);
    await expect(page.locator('button.card')).toHaveCount(3);
    await expect(page.locator('a.card')).toHaveCount(7);
  });

  test('external verify cards carry safe link attributes', async ({ page }) => {
    // Attribute assertions only — the issuer site is never navigated to.
    const card = page.locator('a.card', { hasText: 'Introduction to Linux' });
    await expect(card).toHaveAttribute('href', 'https://stepik.org/cert/2074813');
    await expect(card).toHaveAttribute('target', '_blank');
    await expect(card).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(card.locator('.card-action')).toHaveText('Verify on the issuer site');
  });

  test('pdf card opens the viewer dialog with the document', async ({ page }) => {
    await page.locator('button.card', { hasText: 'AL-1702' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog.locator('.dialog-title')).toContainText('AL-1702');
    await expect(dialog.locator('iframe.dialog-frame')).toHaveAttribute(
      'src',
      /certificates\/astra-linux-1702\.pdf$/,
    );

    const external = dialog.locator('a.dialog-link');
    await expect(external).toHaveAttribute('href', 'certificates/astra-linux-1702.pdf');
    await expect(external).toHaveAttribute('target', '_blank');
    await expect(external).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('pdf dialog closes on escape', async ({ page }) => {
    await page.locator('button.card', { hasText: 'AL-1702' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('pdf dialog closes on overlay click', async ({ page }) => {
    await page.locator('button.card', { hasText: 'AL-1703' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // The ::backdrop covers the viewport behind the dialog; the browser
    // retargets clicks on it to the <dialog> element itself.
    await page.mouse.click(8, 8);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
