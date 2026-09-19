import { describe, expect, it } from "vitest"

import { calculateOrderTotal } from "@/lib/order-totals"
import type { CartItem } from "@/types/cart"

const items: CartItem[] = [
  {
    id: "product-1",
    name: "Product",
    price: 40,
    image: "image",
    images: [],
    category: "Test",
    rating: 5,
    reviews: 1,
    inStock: true,
    description: "Test product",
    specifications: {},
    quantity: 2,
  },
]

describe("calculateOrderTotal", () => {
  it("applies percentage discounts to subtotal and keeps shipping separate", () => {
    expect(
      calculateOrderTotal(items, {
        code: "SAVE10",
        type: "percent",
        value: 10,
      })
    ).toEqual({
      subtotal: 80,
      shipping: 0,
      discount: 8,
      total: 72,
    })
  })

  it("applies fixed discounts without making total negative", () => {
    expect(
      calculateOrderTotal([{ ...items[0], quantity: 1 }], {
        code: "SAVE100",
        type: "fixed",
        value: 100,
      })
    ).toEqual({
      subtotal: 40,
      shipping: 10,
      discount: 40,
      total: 10,
    })
  })

  it("calculates free shipping from the pre-discount subtotal", () => {
    expect(
      calculateOrderTotal([{ ...items[0], quantity: 1 }], {
        code: "SAVE50",
        type: "percent",
        value: 50,
      }).shipping
    ).toBe(10)
  })
})
