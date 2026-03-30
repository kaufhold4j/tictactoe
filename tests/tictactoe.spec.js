import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
});

test('should have the title Tic Tac Toe', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Tic Tac Toe');
});

test('should show Next player: X at start', async ({ page }) => {
  await expect(page.locator('.status')).toHaveText('Next player: X');
});

test('should change player after click', async ({ page }) => {
  const squares = page.locator('.square');
  await squares.nth(0).click();
  await expect(squares.nth(0)).toHaveText('X');
  await expect(page.locator('.status')).toHaveText('Next player: O');
});

test('should detect winner', async ({ page }) => {
  const squares = page.locator('.square');
  // X O X
  // O X O
  // X
  await squares.nth(0).click(); // X
  await squares.nth(1).click(); // O
  await squares.nth(4).click(); // X
  await squares.nth(2).click(); // O
  await squares.nth(8).click(); // X - Winner X (diagonal)

  await expect(page.locator('.status')).toHaveText('Winner: X');
});

test('should reset game', async ({ page }) => {
  const squares = page.locator('.square');
  await squares.nth(0).click();
  await page.locator('.reset-button').click();
  await expect(squares.nth(0)).toHaveText('');
  await expect(page.locator('.status')).toHaveText('Next player: X');
});
