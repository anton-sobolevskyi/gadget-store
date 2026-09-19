import { afterAll, beforeAll, describe, expect, it } from "vitest"
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

import * as schema from "@/db/schema"

let container: StartedPostgreSqlContainer
let sql: ReturnType<typeof postgres>
let db: ReturnType<typeof drizzle<typeof schema>>

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine").start()
  sql = postgres(container.getConnectionUri(), { max: 1 })
  db = drizzle(sql, { schema })
  await migrate(db, { migrationsFolder: "./db/migrations" })
}, 180_000)

afterAll(async () => {
  await sql.end()
  await container.stop()
})

describe("products repository (Postgres via Testcontainers)", () => {
  it("inserts and retrieves a product", async () => {
    const [inserted] = await db
      .insert(schema.products)
      .values({
        slug: "test-product",
        name: "Test Product",
        price: "99.99",
        image: "https://example.com/image.jpg",
        images: ["https://example.com/image.jpg"],
        category: "Testables",
        rating: "4.5",
        reviews: 5,
        inStock: true,
        description: "A product used for integration testing",
        specifications: { Weight: "100g" },
      })
      .returning()

    expect(inserted.id).toBeDefined()

    const found = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, inserted.id),
    })

    expect(found?.name).toBe("Test Product")
    expect(found?.slug).toBe("test-product")
  })

  it("enforces unique slugs", async () => {
    await db.insert(schema.products).values({
      slug: "duplicate-slug",
      name: "First",
      price: "10.00",
      image: "https://example.com/a.jpg",
      images: [],
      category: "Testables",
      rating: "4.0",
      reviews: 0,
      inStock: true,
      description: "First",
      specifications: {},
    })

    await expect(
      db.insert(schema.products).values({
        slug: "duplicate-slug",
        name: "Second",
        price: "20.00",
        image: "https://example.com/b.jpg",
        images: [],
        category: "Testables",
        rating: "4.0",
        reviews: 0,
        inStock: true,
        description: "Second",
        specifications: {},
      })
    ).rejects.toThrow()
  })
})
