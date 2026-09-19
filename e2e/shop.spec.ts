import { expect, test } from "@playwright/test"

test.describe("shopping flow", () => {
  test("home page lists featured products and has no obvious a11y regressions", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveTitle(/Gadget Hub/)
    await expect(
      page.getByRole("heading", { name: "Shop by Category" })
    ).toBeVisible()
  })

  test("can open a product and add it to the cart", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
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
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.getByLabel("Search products").first().fill("headphones")
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/\/search\?q=headphones/)
  })

  test("catalog filters are shareable and show empty states", async ({
    page,
  }) => {
    await page.goto("/products", { waitUntil: "domcontentloaded" })
    await expect(
      page.getByRole("heading", { name: "All Products" })
    ).toBeVisible()

    await page.getByLabel("Search products").fill("headphones")
    await page.getByRole("button", { name: "Apply filters" }).click()
    await expect(page).toHaveURL(/\/products\?q=headphones/)
    await expect(
      page.getByRole("heading", { name: "AirWave Pro Headphones" })
    ).toBeVisible()
    await page.getByRole("button", { name: "Clear all" }).click()
    await expect(page).toHaveURL(/\/products$/)

    await page.getByLabel("Search products").fill("not-a-real-product")
    await page.getByRole("button", { name: "Apply filters" }).click()
    await expect(
      page.getByRole("heading", { name: "No products found" })
    ).toBeVisible()
  })

  test("opens a category and keeps filters in the URL", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.getByRole("link", { name: /smartphones/i }).click()

    await expect(page).toHaveURL(/\/category\/smartphones/)
    await expect(
      page.getByRole("heading", { name: "Smartphones" })
    ).toBeVisible()

    await page.getByLabel("Sort by").selectOption("price-asc")
    await page.getByRole("button", { name: "Apply" }).click()
    await expect(page).toHaveURL(/sort=price-asc/)

    await page.getByRole("button", { name: "Clear" }).click()
    await expect(page).toHaveURL(/\/category\/smartphones$/)
  })

  test("adds and removes a product from the browser-local wishlist", async ({
    page,
  }) => {
    await page.goto("/category/smartphones", {
      waitUntil: "domcontentloaded",
    })
    await page
      .getByRole("button", { name: /add .* to wishlist/i })
      .first()
      .click()

    await page.getByRole("link", { name: "Wishlist" }).click()
    await expect(page).toHaveURL(/\/wishlist/)
    await expect(page.getByText("1 saved product")).toBeVisible()

    await page.getByRole("button", { name: /remove .* from wishlist/i }).click()
    await expect(page.getByText("Your wishlist is empty")).toBeVisible()
  })
})
