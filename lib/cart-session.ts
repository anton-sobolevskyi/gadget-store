import { cookies } from "next/headers"
import { randomUUID } from "crypto"

const CART_SESSION_COOKIE = "cart_session_id"

// Ensures every visitor (guest or signed-in) has a stable id to key their cart row on.
export async function getOrCreateCartSessionId(): Promise<string> {
  const cookieStore = await cookies()
  const existing = cookieStore.get(CART_SESSION_COOKIE)?.value
  if (existing) return existing

  const sessionId = randomUUID()
  cookieStore.set(CART_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  })
  return sessionId
}
