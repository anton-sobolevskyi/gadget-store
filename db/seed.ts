import "dotenv/config"

import { db } from "@/lib/db"
import { products } from "@/db/schema"
import { products as seedProducts } from "@/data/products"
import { slugify } from "@/lib/utils"

async function seed() {
  console.log(`Seeding ${seedProducts.length} products...`)

  for (const product of seedProducts) {
    await db
      .insert(products)
      .values({
        slug: slugify(product.name),
        name: product.name,
        price: product.price.toFixed(2),
        originalPrice: product.originalPrice?.toFixed(2),
        image: product.image,
        images: product.images ?? [product.image],
        category: product.category,
        rating: product.rating.toFixed(1),
        reviews: product.reviews,
        inStock: product.inStock,
        description: product.description,
        specifications: product.specifications,
        colors: product.colors,
        storage: product.storage,
      })
      .onConflictDoNothing({ target: products.slug })
  }

  console.log("Seed complete.")
  process.exit(0)
}

seed().catch(error => {
  console.error("Seed failed:", error)
  process.exit(1)
})
