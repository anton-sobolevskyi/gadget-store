import "dotenv/config"

import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { users } from "@/db/schema"

async function createAdmin() {
  const [email, password] = process.argv.slice(2)
  if (!email || !password) {
    console.error("Usage: pnpm db:create-admin <email> <password>")
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (existing) {
    await db
      .update(users)
      .set({ passwordHash, role: "admin" })
      .where(eq(users.id, existing.id))
    console.log(`Updated ${email} to admin.`)
  } else {
    await db.insert(users).values({ email, passwordHash, role: "admin" })
    console.log(`Created admin user ${email}.`)
  }

  process.exit(0)
}

createAdmin().catch(error => {
  console.error("Failed to create admin:", error)
  process.exit(1)
})
