import { and, eq, ne } from "drizzle-orm"

import { users } from "@/db/schema"
import { db } from "@/lib/db"

export async function getUserById(userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  })
}

export async function updateUserProfile({
  userId,
  name,
  phone,
}: {
  userId: string
  name: string | null
  phone: string | null
}) {
  if (phone) {
    const existingUser = await db.query.users.findFirst({
      where: and(eq(users.phone, phone), ne(users.id, userId)),
      columns: { id: true },
    })

    if (existingUser) throw new Error("This phone number is already in use.")
  }

  const [user] = await db
    .update(users)
    .set({ name, phone })
    .where(eq(users.id, userId))
    .returning()

  return user
}
