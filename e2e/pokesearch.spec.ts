import { test, expect } from '@playwright/test';

test.describe('PokéSearch', () => {
  test('should search for a Pokemon', async ({ page }) => {
    await page.goto('/pokesearch');
    
    const searchInput = page.getByPlaceholder('Search for a Pokemon (min 3 characters)...');
    await searchInput.fill('pikachu');
    
    // Wait for the results to load (debounce + API call)
    await expect(page.getByText('pikachu', { exact: false }).first()).toBeVisible({ timeout: 10000 });
    
    // Check if the card is displayed
    await expect(page.locator('text=pikachu').first()).toBeVisible();
  });

  test('should show validation message for short queries', async ({ page }) => {
    await page.goto('/pokesearch');
    
    const searchInput = page.getByPlaceholder('Search for a Pokemon (min 3 characters)...');
    await searchInput.fill('pi');
    
    await expect(page.getByText('Type at least 3 characters to search')).toBeVisible();
  });
});
