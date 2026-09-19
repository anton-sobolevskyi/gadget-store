import { eq, ilike, or } from "drizzle-orm"

import { db } from "@/lib/db"
import { products as productsTable } from "@/db/schema"
import type { Product } from "@/types/product"

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
