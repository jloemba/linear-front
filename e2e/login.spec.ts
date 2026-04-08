import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should load login page and display all login options', async ({ page }) => {
    await page.goto('/login');

    // Check page title
    await expect(page).toHaveTitle(/Knoyeba-front/i);

    // Check main heading
    await expect(page.locator('text=Se connecter')).toBeVisible();

    // Check social login buttons
    await expect(page.locator('text=Continuer avec Google')).toBeVisible();
    await expect(page.locator('text=Continuer avec Apple')).toBeVisible();
    await expect(page.locator('text=Continuer avec Twitter')).toBeVisible();

    // Check email/password form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('text=Se connecter')).toBeVisible();

    // Check toggle between login/register
    await expect(page.locator('text=Pas de compte ? S\'inscrire')).toBeVisible();
  });

  test('should toggle between login and register modes', async ({ page }) => {
    await page.goto('/login');

    // Initially in login mode
    await expect(page.locator('text=Se connecter')).toBeVisible();
    await expect(page.locator('text=Pas de compte ? S\'inscrire')).toBeVisible();

    // Click to switch to register mode
    await page.locator('text=Pas de compte ? S\'inscrire').click();

    // Now in register mode
    await expect(page.locator('text=S\'inscrire')).toBeVisible();
    await expect(page.locator('text=Déjà un compte ? Se connecter')).toBeVisible();

    // Switch back to login mode
    await page.locator('text=Déjà un compte ? Se connecter').click();
    await expect(page.locator('text=Se connecter')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    await page.locator('button[type="submit"]').click();

    // Check that browser validation prevents submission (required fields)
    // The form should not submit due to HTML5 validation
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to home when authenticated', async ({ page }) => {
    // Mock authenticated state by setting localStorage
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@example.com',
        provider: 'LOCAL'
      }));
    });

    await page.goto('/login');

    // Should redirect to home
    await expect(page).toHaveURL('/');
  });
});