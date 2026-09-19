import type { MetadataRoute } from "next"

import { categories } from "@/data/products"
import { getAllProducts } from "@/lib/repositories/products"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts()

  const productEntries: MetadataRoute.Sitemap = products.map(product => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))
  const categoryEntries: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${SITE_URL}/category/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categoryEntries,
    ...productEntries,
  ]
}
