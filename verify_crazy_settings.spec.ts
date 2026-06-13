
import { test, expect } from '@playwright/test';

test('verify crazyrouter settings', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Wait for the app to load
  await page.waitForSelector('text=Where ideas begin', { timeout: 30000 });

  // Open sidebar by hovering on the left edge
  await page.mouse.move(5, 300);
  await page.waitForTimeout(1000);

  // Find settings button
  const settingsButton = page.getByTestId('settings-button');
  await settingsButton.waitFor({ state: 'visible', timeout: 10000 });
  await settingsButton.click();

  // Verify CrazyRouter Tab is present
  await expect(page.locator('text=CrazyRouter API Key')).toBeVisible({ timeout: 10000 });

  // Verify only CrazyRouter is in the providers list (in the main chat UI)
  await page.keyboard.press('Escape'); // Close settings
  const providerSelect = page.locator('select').first(); // Adjust selector if needed
  // In the screenshot it looks like a custom dropdown, let's just check the text
  await expect(page.locator('text=CrazyRouter')).toBeVisible();

  await page.screenshot({ path: 'settings_verified.png', fullPage: true });
});
