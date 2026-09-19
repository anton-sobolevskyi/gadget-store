import { expect, test } from "@playwright/test"

test.describe("shopping flow", () => {
  test("home page lists featured products and has no obvious a11y regressions", async ({
    page,
  }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Gadget Hub/)
    await expect(
      page.getByRole("heading", { name: "Shop by Category" })
    ).toBeVisible()
  })

  test("can open a product and add it to the cart", async ({ page }) => {
    await page.goto("/")
    const firstProductLink = page
      .getByRole("link")
      .filter({
        has: page.getByRole("heading", { level: 3 }),
      })
      .first()
    await firstProductLink.click()

    await expect(page).toHaveURL(/\/product\//)
    await page
      .getByRole("button", { name: /add to cart/i })
      .first()
      .click()

    await page.getByRole("link", { name: /^cart/i }).click()
    await expect(page).toHaveURL(/\/cart/)
  })

  test("search form navigates to results", async ({ page }) => {
    await page.goto("/")
    await page.getByLabel("Search products").first().fill("headphones")
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/\/search\?q=headphones/)
  })
})
