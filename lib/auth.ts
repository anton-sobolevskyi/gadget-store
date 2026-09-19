import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { normalizePhone } from "@/lib/customer"
import { getCartSessionId } from "@/lib/cart-session"
import { mergeGuestCartIntoUser } from "@/lib/repositories/cart"
import { users, type UserRole } from "@/db/schema"

const credentialsSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(7).optional(),
    password: z.string().min(8),
  })
  .refine(value => value.email || value.phone)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        phone: { label: "Phone number", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      authorize: async credentials => {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = parsed.data.phone
          ? await db.query.users.findFirst({
              where: eq(users.phone, normalizePhone(parsed.data.phone)),
            })
          : await db.query.users.findFirst({
              where: eq(users.email, parsed.data.email!),
            })
        if (!user?.passwordHash) return null

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        )
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
    // Only registered when credentials are configured, so local dev without
    // Google OAuth set up doesn't crash on missing env vars.
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      // Fold any guest-session cart into the account being signed into.
      if (user.id) {
        const sessionId = await getCartSessionId()
        if (sessionId) await mergeGuestCartIntoUser(sessionId, user.id)
      }
      return true
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        // Google sign-in doesn't return `role`, so fall back to a DB lookup.
        const dbUser = user.id
          ? await db.query.users.findFirst({ where: eq(users.id, user.id) })
          : undefined
        token.role = user.role ?? dbUser?.role ?? "customer"
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
})
