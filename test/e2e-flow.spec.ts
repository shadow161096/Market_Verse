import { test, expect } from '@playwright/test';

test.describe('MarketVerse End-to-End Flow', () => {
    test('should allow a user to search, view and add to cart', async ({ page }) => {
        // 1. Visit Home
        await page.goto('http://localhost:3000');
        await expect(page.locator('h1')).toContainText('Universe');

        // 2. Search for a product
        await page.click('button:has-text("Search")');
        await page.fill('input[type="text"]', 'Cyber');
        await page.keyboard.press('Enter');

        // 3. Navigate to product detail
        await page.click('text=View Details'); // Assuming this text exists in ProductCard
        await expect(page).toHaveURL(/.*\/products\/.*/);

        // 4. Add to cart
        await page.click('button:has-text("Add to Cart")');
        await expect(page.locator('text=Cart updated')).toBeVisible();
    });
});
