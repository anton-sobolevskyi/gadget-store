"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { getOrCreateCartSessionId } from "@/lib/cart-session"
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/repositories/cart"

async function getIdentity() {
  const session = await auth()
  const sessionId = await getOrCreateCartSessionId()
  return { sessionId, userId: session?.user?.id }
}

export async function getCartAction() {
  const { sessionId, userId } = await getIdentity()
  return getCart(sessionId, userId)
}

export async function addToCartAction(
  productId: string,
  quantity = 1,
  selectedColor?: string,
  selectedStorage?: string
) {
  const { sessionId, userId } = await getIdentity()
  await addCartItem(
    sessionId,
    productId,
    quantity,
    selectedColor,
    selectedStorage,
    userId
  )
  revalidatePath("/cart")
}

export async function updateCartItemAction(
  productId: string,
  quantity: number
) {
  const { sessionId, userId } = await getIdentity()
  await updateCartItemQuantity(sessionId, productId, quantity, userId)
  revalidatePath("/cart")
}

export async function removeFromCartAction(productId: string) {
  const { sessionId, userId } = await getIdentity()
  await removeCartItem(sessionId, productId, userId)
  revalidatePath("/cart")
}

export async function clearCartAction() {
  const { sessionId, userId } = await getIdentity()
  await clearCart(sessionId, userId)
  revalidatePath("/cart")
}
