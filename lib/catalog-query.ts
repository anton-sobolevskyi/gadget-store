import type { Product } from "@/types/product"

export const CATALOG_PAGE_SIZE = 8

export type CatalogQuery = {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sort?: "price-asc" | "price-desc" | "rating-desc"
  page: number
}

export type CatalogResult = {
  products: Product[]
  total: number
  page: number
  pageCount: number
}

type SearchParamsInput = Record<string, string | string[] | undefined>

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function positiveNumber(value: string | undefined) {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

export function parseCatalogQuery(params: SearchParamsInput): CatalogQuery {
  const sort = firstParam(params.sort)
  const page = Number(firstParam(params.page))

  return {
    query: firstParam(params.q)?.trim() || undefined,
    category: firstParam(params.category)?.trim() || undefined,
    minPrice: positiveNumber(firstParam(params.minPrice)),
    maxPrice: positiveNumber(firstParam(params.maxPrice)),
    inStock: firstParam(params.inStock) === "true" ? true : undefined,
    sort:
      sort === "price-asc" || sort === "price-desc" || sort === "rating-desc"
        ? sort
        : undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function filterCatalogProducts(
  products: Product[],
  query: CatalogQuery
): CatalogResult {
  const normalizedQuery = query.query?.toLowerCase()
  const filtered = products
    .filter(product => {
      if (query.category && product.category !== query.category) return false
      if (query.inStock && !product.inStock) return false
      if (query.minPrice !== undefined && product.price < query.minPrice) {
        return false
      }
      if (query.maxPrice !== undefined && product.price > query.maxPrice) {
        return false
      }
      if (
        normalizedQuery &&
        ![product.name, product.category, product.description].some(value =>
          value.toLowerCase().includes(normalizedQuery)
        )
      ) {
        return false
      }
      return true
    })
    .sort((first, second) => {
      switch (query.sort) {
        case "price-asc":
          return first.price - second.price
        case "price-desc":
          return second.price - first.price
        case "rating-desc":
          return second.rating - first.rating
        default:
          return 0
      }
    })

  const pageCount = Math.max(1, Math.ceil(filtered.length / CATALOG_PAGE_SIZE))
  const page = Math.min(query.page, pageCount)
  const start = (page - 1) * CATALOG_PAGE_SIZE

  return {
    products: filtered.slice(start, start + CATALOG_PAGE_SIZE),
    total: filtered.length,
    page,
    pageCount,
  }
}
