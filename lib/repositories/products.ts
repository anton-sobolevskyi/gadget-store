import { eq, ilike, or } from "drizzle-orm"

import { db } from "@/lib/db"
import { products as productsTable } from "@/db/schema"
import { slugify } from "@/lib/utils"
import type { Product } from "@/types/product"
import {
  filterCatalogProducts,
  type CatalogQuery,
  type CatalogResult,
} from "@/lib/catalog-query"

type ProductRow = typeof productsTable.$inferSelect

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
    image: row.image,
    images: row.images,
    category: row.category,
    rating: Number(row.rating),
    reviews: row.reviews,
    inStock: row.inStock,
    description: row.description,
    specifications: row.specifications,
    colors: row.colors ?? undefined,
    storage: row.storage ?? undefined,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    orderBy: (products, { asc }) => [asc(products.createdAt)],
  })
  return rows.map(toProduct)
}

export async function getCatalogProducts(
  query: CatalogQuery
): Promise<CatalogResult> {
  return filterCatalogProducts(await getAllProducts(), query)
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await db.query.products.findFirst({
    where: eq(productsTable.id, id),
  })
  return row ? toProduct(row) : null
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.query.products.findFirst({
    where: eq(productsTable.slug, slug),
  })
  return row ? toProduct(row) : null
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    where: eq(productsTable.category, category),
  })
  return rows.map(toProduct)
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const rows = await getProductsByCategory(product.category)
  return rows.filter(p => p.id !== product.id).slice(0, limit)
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const rows = await getAllProducts()
  return rows.slice(0, limit)
}

export async function getBestSellers(minRating = 4.7): Promise<Product[]> {
  const rows = await getAllProducts()
  return rows.filter(p => p.rating >= minRating)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const term = query.trim()
  if (!term) return []

  const pattern = `%${term}%`
  const rows = await db.query.products.findMany({
    where: or(
      ilike(productsTable.name, pattern),
      ilike(productsTable.category, pattern),
      ilike(productsTable.description, pattern)
    ),
  })
  return rows.map(toProduct)
}

export type ProductInput = {
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  description: string
  specifications: Record<string, string>
  colors?: string[]
  storage?: string[]
  inStock: boolean
}

function toRowValues(input: ProductInput) {
  return {
    name: input.name,
    price: input.price.toFixed(2),
    originalPrice: input.originalPrice?.toFixed(2),
    image: input.image,
    images: input.images ?? [input.image],
    category: input.category,
    description: input.description,
    specifications: input.specifications,
    colors: input.colors,
    storage: input.storage,
    inStock: input.inStock,
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const slug = slugify(input.name)
  const [row] = await db
    .insert(productsTable)
    .values({ slug, ...toRowValues(input) })
    .returning()
  return toProduct(row)
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product | null> {
  const [row] = await db
    .update(productsTable)
    .set({ ...toRowValues(input), updatedAt: new Date() })
    .where(eq(productsTable.id, id))
    .returning()
  return row ? toProduct(row) : null
}

export async function deleteProduct(id: string): Promise<void> {
  await db.delete(productsTable).where(eq(productsTable.id, id))
}
