import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "@/db/schema"

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Reuse the connection across hot-reloads in dev to avoid exhausting Postgres connections.
const client =
  globalForDb.client ?? postgres(process.env.DATABASE_URL, { max: 10 })

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client
}

export const db = drizzle(client, { schema })
