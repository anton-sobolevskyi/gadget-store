import { describe, expect, it } from "vitest"

import { getCategoryById } from "@/data/products"

describe("getCategoryById", () => {
  it("maps a URL-safe category id to its catalog display name", () => {
    expect(getCategoryById("smartphones")).toMatchObject({
      id: "smartphones",
      name: "Smartphones",
    })
  })

  it("returns undefined for an unknown category id", () => {
    expect(getCategoryById("unknown")).toBeUndefined()
  })
})
