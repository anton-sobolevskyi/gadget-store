import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { users } from "@/db/schema"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

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
        password: { label: "Password", type: "password" },
      },
      authorize: async credentials => {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, parsed.data.email),
        })
        if (!user?.passwordHash) return null

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        )
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email }
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
    jwt: async ({ token, user }) => {
      if (user) token.id = user.id
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
})
