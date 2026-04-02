import { test, expect } from '@playwright/test';

test('homepage should load and display key UI elements', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Knoyeba-front/i);
  await expect(page.locator('text=🌐 Ton fil')).toBeVisible();
  await expect(page.locator('text=Créer une toile')).toBeVisible();
});
