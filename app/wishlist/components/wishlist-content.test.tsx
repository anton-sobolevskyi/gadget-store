import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { WishlistContent } from "@/app/wishlist/components/wishlist-content"
import { useStore } from "@/hooks/useStore"
import type { Product } from "@/types/product"

vi.mock("@/app/components/product-card", () => ({
  ProductCard: ({ product }: { product: Product }) => <p>{product.name}</p>,
}))

const products: Product[] = [
  {
    id: "1",
    name: "Galaxy Pro X Max",
    price: 1299,
    image: "https://example.com/phone.jpg",
    category: "Smartphones",
    rating: 4.8,
    reviews: 1243,
    inStock: true,
    description: "A great phone",
    specifications: {},
  },
]

describe("WishlistContent", () => {
  beforeEach(() => {
    useStore.setState({ wishlist: [], hasHydrated: false })
  })

  it("waits for local storage hydration before showing an empty state", () => {
    render(<WishlistContent products={products} />)

    expect(screen.getByText("Loading saved products...")).toBeInTheDocument()
    expect(screen.queryByText("Your wishlist is empty")).not.toBeInTheDocument()
  })

  it("shows the empty state after hydration when no products are saved", () => {
    useStore.setState({ hasHydrated: true })
    render(<WishlistContent products={products} />)

    expect(screen.getByText("Your wishlist is empty")).toBeInTheDocument()
  })

  it("renders only products saved in the local wishlist", () => {
    useStore.setState({ wishlist: ["1"], hasHydrated: true })
    render(<WishlistContent products={products} />)

    expect(screen.getByText("Galaxy Pro X Max")).toBeInTheDocument()
    expect(screen.getByText("1 saved product")).toBeInTheDocument()
  })
})
