import { expect, type Page, test } from '@playwright/test';

async function expectWithinViewport(page: Page, selector: string): Promise<void> {
  const clipped = await page.locator(selector).evaluateAll((elements) =>
    elements
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && (rect.left < -1 || rect.right > window.innerWidth + 1);
      })
      .map((element) => element.textContent.trim()),
  );
  expect(clipped).toEqual([]);
}

test.describe('mobile layout', () => {
  for (const width of [320, 393, 768, 1024]) {
    test(`header and content fit at ${String(width)}px in both locales`, async ({ page }) => {
      await page.setViewportSize({ width, height: 852 });
      // Exercise the unavailable state without contacting external stats APIs.
      await page.route(/^https:\/\//, (route) =>
        route.fulfill({ status: 503, body: 'unavailable' }),
      );

      for (const path of ['/', '/certificates', '/stats']) {
        await page.goto(path);
        await expect(page.locator('h1')).toBeVisible();
        for (const locale of ['en', 'ru']) {
          await page.getByRole('button', { name: locale, exact: true }).click();
          await expect(page.locator('a.brand')).toHaveText(
            locale === 'en' ? 'Portfolio' : 'Портфолио',
          );
          await expectWithinViewport(page, '.header a, .header button');
          await expectWithinViewport(
            page,
            '.highlight, .education-item, .languages, .card, .channel, .chip, .cluster, ' +
              '.name, .summary, .cta a, .stat-card, .page-title, .page-subtitle',
          );
        }
      }
    });
  }

  test('mobile menu reaches every section and the certificates page', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    const links = page.locator('#header-links');
    await expect(links).toBeHidden();

    for (const fragment of ['about', 'experience', 'work', 'stack', 'contact']) {
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await expect(links.getByRole('link')).toHaveCount(7);
      await expectWithinViewport(page, '#header-links a');
      await links.locator(`a[href="/#${fragment}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#${fragment}$`));
      await expect(links).toBeHidden();
      await expect(page.locator(`#${fragment}`)).toBeInViewport();
    }

    await menu.click();
    await links.getByRole('link', { name: 'Certificates' }).click();
    await expect(page).toHaveURL(/\/certificates$/);
    await expect(links).toBeHidden();
    await menu.click();
    await expect(links.getByRole('link', { name: 'Certificates' })).toHaveClass(/link-active/);
    await links.getByRole('link', { name: 'Stack', exact: true }).click();
    await expect(page).toHaveURL(/\/#stack$/);
    await expect(page.locator('#stack')).toBeInViewport();
    await expect(links).toBeHidden();
  });

  test('menu closes with Escape, an outside tap and a second toggle', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    const links = page.locator('#header-links');
    await menu.click();
    await links.getByRole('link').first().focus();
    await page.keyboard.press('Escape');
    await expect(links).toBeHidden();
    await expect(menu).toBeFocused();

    await menu.click();
    await page.locator('.summary').click();
    await expect(links).toBeHidden();
    await menu.click();
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');

    const smallTargets = await page
      .locator('.header button')
      .evaluateAll(
        (buttons) => buttons.filter((button) => button.getBoundingClientRect().height < 44).length,
      );
    expect(smallTargets).toBe(0);
  });

  test('Russian menu stays usable in short landscape and after resizing to desktop', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 852, height: 320 });
    await page.route(/^https:\/\//, (route) => route.fulfill({ status: 503, body: 'unavailable' }));
    await page.goto('/');
    await page.getByRole('button', { name: 'ru', exact: true }).click();
    const menu = page.getByRole('button', { name: 'Меню', exact: true });
    await menu.click();
    const stats = page.locator('#header-links').getByRole('link', { name: 'Статистика' });
    await stats.scrollIntoViewIfNeeded();
    await expect(stats).toBeInViewport();
    await stats.click();
    await expect(page).toHaveURL(/\/stats$/);
    await expect(menu).toHaveAttribute('aria-expanded', 'false');

    await menu.click();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(menu).toBeHidden();
    await expect(stats).toBeVisible();
    await page.setViewportSize({ width: 393, height: 852 });
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#header-links')).toBeHidden();
  });
});
