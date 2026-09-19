import { beforeEach, describe, expect, it } from "vitest"

import { useStore } from "@/hooks/useStore"

describe("useStore wishlist logic", () => {
  beforeEach(() => {
    useStore.setState({ wishlist: [] })
  })

  it("toggles wishlist membership", () => {
    useStore.getState().toggleWishlist("1")
    expect(useStore.getState().wishlist).toContain("1")
    useStore.getState().toggleWishlist("1")
    expect(useStore.getState().wishlist).not.toContain("1")
  })
})
