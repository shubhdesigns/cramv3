import { test, expect } from "@playwright/test";

test("Landing page loads and nav works", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Cramtime")).toBeVisible();
  await expect(page.locator("text=Get Started")).toBeVisible();
  await page.click("text=Get Started");
  await expect(page).toHaveURL(/login/);
});

test("Google login interface displays", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("text=Sign in with Google")).toBeVisible();
});

// More tests: simulate quiz taking, flashcards, etc when UI ready