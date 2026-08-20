import { expect, test } from '@playwright/test';

test.describe('landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero renders the person, availability and experience line', async ({ page }) => {
    await expect(page.locator('h1.name')).toHaveText('Danil Kovalev');
    await expect(page.locator('.hero .availability')).toContainText('Rostov-on-Don');
    await expect(page.locator('.hero .summary')).toContainText('async architecture');
    await expect(page.locator('.hero .experience')).toContainText('of production experience');
  });

  test('marquee repeats the roles with aria-hidden copies', async ({ page }) => {
    const items = page.locator('[data-marquee] .role-item');
    await expect(items).toHaveCount(8);
    await expect(items.first()).toHaveText('high-load Rust services');
    await expect(page.locator('[data-marquee] .role-item[aria-hidden="true"]')).toHaveCount(4);
  });

  test('tech rings render the lead technology chips', async ({ page }) => {
    await expect(page.locator('[data-ring]')).toBeVisible();
    await expect(page.locator('[data-ring] app-tech-chip')).toHaveCount(18);
  });

  test('about, experience, stack and education show real content', async ({ page }) => {
    await expect(page.locator('#about .highlight')).toHaveCount(3);
    await expect(page.locator('#about')).toContainText('OpenTelemetry');

    const experience = page.locator('#experience');
    await expect(experience.locator('.title')).toContainText('of taking the slow path out');
    await expect(experience).toContainText('SRI Spetsvuzavtomatika');
    await expect(experience).toContainText('Iktin Group');
    await expect(experience).toContainText('Ecom.tech');

    await expect(page.locator('#stack .title')).toHaveText('What I reach for');
    await expect(page.locator('#education')).toContainText('Don State Technical University');
    await expect(page.locator('#education')).toContainText('Russian');
  });

  test('work section links every project card to its repository', async ({ page }) => {
    const section = page.locator('#work');
    await expect(section.locator('.title')).toHaveText('Open source: dishka integrations');

    // External links are checked by attribute only — never navigated to.
    const dishka = section.locator('.subtitle-link');
    await expect(dishka).toHaveAttribute('href', 'https://github.com/reagento/dishka');
    await expect(dishka).toHaveAttribute('target', '_blank');
    await expect(dishka).toHaveAttribute('rel', 'noopener noreferrer');

    const cards = section.locator('a.card');
    await expect(cards).toHaveCount(4);
    for (const name of ['dishka-ag2', 'dishka-airflow', 'dishka-jobify', 'dishka-flet']) {
      const card = section.locator(`a.card[aria-label="${name}"]`);
      await expect(card).toHaveAttribute('href', `https://github.com/C3EQUALZz/${name}`);
      await expect(card).toHaveAttribute('target', '_blank');
      await expect(card).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('contact section exposes channels with safe link attributes', async ({ page }) => {
    const section = page.locator('#contact');
    await expect(section.locator('.title')).toHaveText('Open to Rust and Python backend roles');

    const telegram = section.locator('a[href="https://t.me/computerScienceEnjoyer"]');
    await expect(telegram).toHaveAttribute('target', '_blank');
    await expect(telegram).toHaveAttribute('rel', 'noopener noreferrer');

    const github = section.locator('a[href="https://github.com/C3EQUALZz"]');
    await expect(github).toHaveAttribute('target', '_blank');
    await expect(github).toHaveAttribute('rel', 'noopener noreferrer');

    const email = section.locator('a[href="mailto:dan.kovalev2013@gmail.com"]');
    await expect(email).toBeVisible();
    await expect(email).not.toHaveAttribute('target', '_blank');
  });

  test('hero ctas and scroll-down anchor to their sections', async ({ page }) => {
    await page.locator('a.cta-primary').click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator('#work')).toBeInViewport();

    await page.locator('a.cta-secondary').click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeInViewport();

    await page.locator('a.scroll-down').click();
    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator('#about')).toBeInViewport();
  });

  test('footer shows the note', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('Danil Kovalev');
    await expect(page.locator('footer')).toContainText('Backend engineer');
  });
});
