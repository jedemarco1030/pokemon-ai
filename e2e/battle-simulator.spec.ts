import { test, expect } from '@playwright/test';

test.describe('Battle Simulator', () => {
  test('should show login requirement when not authenticated', async ({ page }) => {
    await page.goto('/battle-simulator');
    
    // Increase timeout for auth initialization
    await expect(page.getByText('Please log in to test your teams in the battle simulator.')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Login' }).nth(1)).toBeVisible();
  });

  test('should navigate from home page to battle simulator feature', async ({ page }) => {
    await page.goto('/');
    
    const battleSimCard = page.locator('text=AI Battle Simulator').first();
    await expect(battleSimCard).toBeVisible();
    
    await page.click('text=Go to Battle Simulator');
    await expect(page).toHaveURL('/battle-simulator');
  });
});
