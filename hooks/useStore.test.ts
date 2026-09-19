import { beforeEach, describe, expect, it } from "vitest"

import { useStore } from "@/hooks/useStore"
import type { Product } from "@/types/product"

const product: Product = {
  id: "1",
  name: "Test Phone",
  price: 100,
  image: "https://example.com/image.jpg",
  category: "Smartphones",
  rating: 4.5,
  reviews: 10,
  inStock: true,
  description: "A test product",
  specifications: {},
}

describe("useStore cart logic", () => {
  beforeEach(() => {
    useStore.setState({ cart: [], wishlist: [] })
  })

  it("adds a new product to the cart", () => {
    useStore.getState().addToCart(product)
    expect(useStore.getState().cart).toHaveLength(1)
    expect(useStore.getState().getCartCount()).toBe(1)
  })

  it("increments quantity for the same product/variant instead of duplicating", () => {
    useStore.getState().addToCart(product, 2)
    useStore.getState().addToCart(product, 3)
    expect(useStore.getState().cart).toHaveLength(1)
    expect(useStore.getState().getCartCount()).toBe(5)
  })

  it("treats different variants as separate cart lines", () => {
    useStore.getState().addToCart(product, 1, "Black")
    useStore.getState().addToCart(product, 1, "White")
    expect(useStore.getState().cart).toHaveLength(2)
  })

  it("removes a product from the cart", () => {
    useStore.getState().addToCart(product)
    useStore.getState().removeFromCart(product.id)
    expect(useStore.getState().cart).toHaveLength(0)
  })

  it("computes the cart total from price * quantity", () => {
    useStore.getState().addToCart(product, 3)
    expect(useStore.getState().getCartTotal()).toBe(300)
  })

  it("does not allow quantity below 1", () => {
    useStore.getState().addToCart(product)
    useStore.getState().updateQuantity(product.id, 0)
    expect(useStore.getState().cart[0].quantity).toBe(1)
  })

  it("toggles wishlist membership", () => {
    useStore.getState().toggleWishlist(product.id)
    expect(useStore.getState().wishlist).toContain(product.id)
    useStore.getState().toggleWishlist(product.id)
    expect(useStore.getState().wishlist).not.toContain(product.id)
  })
})
