
import { test, expect } from '@playwright/test';

test('a aplicação GreenMint carrega', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toBeVisible();
});
