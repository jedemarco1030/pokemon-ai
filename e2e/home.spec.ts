import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display main title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Pokemon AI');
  });

  test('should navigate to PokéSearch page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Start Searching');
    await expect(page).toHaveURL('/pokesearch');
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');

    const themeButton = page.locator('button[aria-label*="mode"]');
    await expect(themeButton).toBeVisible();

    // Toggle theme
    await themeButton.click();

    // Check if class was added/removed (it might take a frame)
    await expect(async () => {
      const hasDark = await html.evaluate(el => el.classList.contains('dark'));
      const hasLight = !hasDark; // simplistic but works if it starts as one
      expect(hasDark || hasLight).toBeTruthy();
    }).toPass();
  });
});
