import { test, expect } from '@playwright/test';

test('user can sign up, take quiz, see progress', async ({ page }) => {
  await page.goto('http://localhost:4321/'); // Adjust as needed for local dev
  await page.click('text=Login');
  // Simulate email signup/login flow
  await page.fill('[name="email"]', `test${Date.now()}@test.com`);
  await page.fill('[name="password"]', 'pwTEST!23');
  await page.click('text=Sign Up');
  await page.waitForSelector('text=Dashboard');
  // Navigate to quiz
  await page.click('text=Subjects');
  await page.click('text=AP Biology');
  await page.click('text=Take Quiz');
  await page.click('button:has-text("Submit")');
  const score = await page.textContent('.font-semibold.text-xl');
  expect(score).toMatch(/Score:/);
  // Check dashboard (progress shown)
  await page.click('text=Dashboard');
  expect(await page.textContent('body')).toContain('Progress');
});