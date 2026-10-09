import { expect, type Page, type Route, test } from '@playwright/test';

/** alfa-leetcode-api profile payload (documented shape; see api-fixtures.ts). */
const alfaProfile = {
  username: 'c3equalzRU',
  ranking: 500001,
  totalSolved: 9,
  totalQuestions: 3989,
  easySolved: 6,
  totalEasy: 960,
  mediumSolved: 3,
  totalMedium: 2103,
  hardSolved: 0,
  totalHard: 966,
  contestAttend: 0,
};

const alfaCalendar = {
  streak: 2,
  totalActiveDays: 5,
  submissionCalendar: '{"1753982400": 2, "1754068800": 1}',
};

const codeforcesInfo = {
  status: 'OK',
  result: [{ handle: 'c3equalz', contribution: 0, registrationTimeSeconds: 1701032920 }],
};

const codeforcesEmpty = { status: 'OK', result: [] };

const codewarsUser = {
  username: 'C3EQUALZz',
  honor: 16,
  leaderboardPosition: null,
  ranks: { overall: { rank: -8, name: '8 kyu', color: 'white', score: 16 } },
  codeChallenges: { totalAuthored: 0, totalCompleted: 7 },
};

function fulfillJson(route: Route, body: unknown): Promise<void> {
  return route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/** Every external API the stats page talks to — stubbed, never real. */
async function stubStatsApis(page: Page, options?: { failLeetCode?: boolean }): Promise<void> {
  await page.route('**/alfa-leetcode-api.onrender.com/**', (route) => {
    if (options?.failLeetCode ?? false) {
      return route.fulfill({ status: 503, body: 'down' });
    }
    const url = route.request().url();
    if (url.endsWith('/profile')) {
      return fulfillJson(route, alfaProfile);
    }
    if (url.endsWith('/calendar')) {
      return fulfillJson(route, alfaCalendar);
    }
    return fulfillJson(route, {});
  });
  await page.route('**/codeforces.com/api/user.info*', (route) =>
    fulfillJson(route, codeforcesInfo),
  );
  await page.route('**/codeforces.com/api/**', (route) => fulfillJson(route, codeforcesEmpty));
  await page.route('**/codewars.com/api/**', (route) => fulfillJson(route, codewarsUser));
}

test.describe('stats page', () => {
  test('loaded stats stay readable on a narrow phone in both locales', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await stubStatsApis(page);
    await page.goto('/stats');
    await expect(page.locator('.donut-total')).toHaveText('9');

    for (const locale of ['en', 'ru']) {
      await page.getByRole('button', { name: locale, exact: true }).click();
      await expect(page.locator('a.brand')).toHaveText(locale === 'en' ? 'Portfolio' : 'Портфолио');
      const clipped = await page
        .locator('.stat-card-head, .stat-foot, .lc-summary, .bar-head, .cf-summary, .cw-summary')
        .evaluateAll((elements) =>
          elements
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              return rect.left < 0 || rect.right > window.innerWidth;
            })
            .map((element) => ({
              className: element.getAttribute('class'),
              right: element.getBoundingClientRect().right,
            })),
        );
      expect(clipped).toEqual([]);
    }
  });

  test('renders the cards from the stubbed APIs', async ({ page }) => {
    await stubStatsApis(page);
    await page.goto('/stats');

    await expect(page.locator('.page-title')).toHaveText('Coding stats');
    await expect(page.locator('.page-headline')).toContainText('16 problems solved');

    const leetcode = page.locator('.stat-card', { hasText: 'LeetCode' });
    await expect(leetcode.locator('.donut-total')).toHaveText('9');
    await expect(leetcode.locator('.bar-value').first()).toContainText('6 / 960');
    await expect(leetcode.locator('.fact-value').first()).toContainText('#500001');

    const codewars = page.locator('.stat-card', { hasText: 'Codewars' });
    await expect(codewars.locator('.cw-kyu-badge')).toHaveText('8 kyu');
  });

  test('shows the unavailable card when every LeetCode source fails', async ({ page }) => {
    await stubStatsApis(page, { failLeetCode: true });
    await page.goto('/stats');

    const leetcode = page.locator('.stat-card', { hasText: 'LeetCode' });
    await expect(leetcode).toContainText('Stats unavailable right now');

    // The other platforms are unaffected.
    await expect(page.locator('.stat-card', { hasText: 'Codewars' })).toContainText('8 kyu');
  });

  test('the retry button recovers the card once the source is back', async ({ page }) => {
    await stubStatsApis(page, { failLeetCode: true });
    await page.goto('/stats');

    const leetcode = page.locator('.stat-card', { hasText: 'LeetCode' });
    await expect(leetcode).toContainText('Stats unavailable right now');

    await page.unroute('**/alfa-leetcode-api.onrender.com/**');
    await stubStatsApis(page);
    await leetcode.getByRole('button', { name: 'Try again' }).click();

    await expect(leetcode.locator('.donut-total')).toHaveText('9');
  });

  test('the header links to the stats page', async ({ page }) => {
    await stubStatsApis(page);
    await page.goto('/');

    await page.locator('.header-nav a', { hasText: 'Stats' }).click();

    await expect(page).toHaveURL(/\/stats$/);
    await expect(page.locator('.page-title')).toHaveText('Coding stats');
  });
});
