import { describe, expect, it } from "vitest"

import { products } from "@/data/products"
import { filterCatalogProducts, parseCatalogQuery } from "@/lib/catalog-query"

describe("catalog query", () => {
  it("normalizes valid and invalid URL parameters", () => {
    expect(
      parseCatalogQuery({
        q: "  phone ",
        minPrice: "500",
        maxPrice: "invalid",
        inStock: "true",
        sort: "price-asc",
        page: "2",
      })
    ).toEqual({
      query: "phone",
      category: undefined,
      minPrice: 500,
      maxPrice: undefined,
      inStock: true,
      sort: "price-asc",
      page: 2,
    })
  })

  it("filters, sorts, and clamps pagination", () => {
    const result = filterCatalogProducts(products, {
      category: "Audio",
      minPrice: 300,
      maxPrice: 400,
      sort: "price-desc",
      page: 99,
    })

    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
    expect(result.pageCount).toBe(1)
    expect(result.products[0]?.name).toBe("AirWave Pro Headphones")
  })

  it("returns an empty result for unmatched search terms", () => {
    const result = filterCatalogProducts(products, {
      query: "not a real gadget",
      page: 1,
    })

    expect(result.total).toBe(0)
    expect(result.products).toEqual([])
  })
})
