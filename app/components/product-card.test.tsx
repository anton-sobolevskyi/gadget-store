import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ProductCard } from "@/app/components/product-card"
import { useStore } from "@/hooks/useStore"
import type { Product } from "@/types/product"

vi.mock("sonner", () => ({
  toast: { success: vi.fn() },
}))

const product: Product = {
  id: "1",
  name: "Galaxy Pro X Max",
  price: 1299,
  originalPrice: 1499,
  image: "https://images.unsplash.com/photo.jpg",
  category: "Smartphones",
  rating: 4.8,
  reviews: 1243,
  inStock: true,
  description: "A great phone",
  specifications: {},
}

describe("ProductCard", () => {
  beforeEach(() => {
    useStore.setState({ cart: [], wishlist: [] })
  })

  it("renders product name, price and discount badge", () => {
    render(<ProductCard product={product} />)

    expect(
      screen.getByRole("heading", { name: "Galaxy Pro X Max" })
    ).toBeInTheDocument()
    expect(screen.getByText("$1299")).toBeInTheDocument()
    expect(screen.getByText("Save 13%")).toBeInTheDocument()
  })

  it("links to the product detail page", () => {
    render(<ProductCard product={product} />)
    expect(screen.getByRole("link")).toHaveAttribute("href", "/product/1")
  })

  it("adds the product to the cart when clicking Add to Cart", async () => {
    const user = userEvent.setup()
    render(<ProductCard product={product} />)

    await user.click(screen.getByRole("button", { name: /add to cart/i }))

    expect(useStore.getState().cart).toHaveLength(1)
    expect(useStore.getState().cart[0].id).toBe("1")
  })

  it("disables the button and shows Out of Stock when unavailable", () => {
    render(<ProductCard product={{ ...product, inStock: false }} />)
    const button = screen.getByRole("button", { name: /out of stock/i })
    expect(button).toBeDisabled()
  })
})
