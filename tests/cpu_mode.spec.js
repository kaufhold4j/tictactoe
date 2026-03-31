import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
});

test('CPU should move automatically when enabled', async ({ page }) => {
  // Enable CPU mode
  const cpuToggle = page.locator('.cpu-toggle');
  await cpuToggle.click();
  await expect(cpuToggle).toHaveText('Vs Computer: ON');

  const squares = page.locator('.square');

  // Player X moves at center
  await squares.nth(4).click();
  await expect(squares.nth(4)).toHaveText('X');

  // Wait for CPU (O) to move
  await expect(page.locator('.status')).toHaveText('Next player: X');

  // Verify that there is an 'O' on the board
  const oCount = await squares.evaluateAll(elements =>
    elements.filter(el => el.textContent === 'O').length
  );
  expect(oCount).toBe(1);
});

test('CPU should be smart enough to win or block', async ({ page }) => {
    // Enable CPU mode
    await page.locator('.cpu-toggle').click();

    const squares = page.locator('.square');

    // X at 0
    await squares.nth(0).click();
    // O should move (e.g., at 4)
    await page.waitForTimeout(1000);

    // X at 1
    await squares.nth(1).click();
    // O should move to 2 to block X from winning if X was about to win,
    // but here X has 0, 1. O must block at 2.

    await expect(squares.nth(2)).toHaveText('O');
});
