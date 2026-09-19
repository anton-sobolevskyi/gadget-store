import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { cartItems, carts, products } from "@/db/schema"
import type { CartItem } from "@/types/cart"

async function findOrCreateCart(sessionId: string, userId?: string) {
  const existing = await db.query.carts.findFirst({
    where: userId ? eq(carts.userId, userId) : eq(carts.sessionId, sessionId),
  })
  if (existing) return existing

  const [created] = await db
    .insert(carts)
    .values({ sessionId, userId })
    .returning()
  return created
}

export async function getCart(
  sessionId: string,
  userId?: string
): Promise<CartItem[]> {
  const cart = await findOrCreateCart(sessionId, userId)

  const rows = await db
    .select({ item: cartItems, product: products })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id))

  return rows.map(({ item, product }) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    originalPrice: product.originalPrice
      ? Number(product.originalPrice)
      : undefined,
    image: product.image,
    images: product.images,
    category: product.category,
    rating: Number(product.rating),
    reviews: product.reviews,
    inStock: product.inStock,
    description: product.description,
    specifications: product.specifications,
    colors: product.colors ?? undefined,
    storage: product.storage ?? undefined,
    quantity: item.quantity,
    selectedColor: item.selectedColor ?? undefined,
    selectedStorage: item.selectedStorage ?? undefined,
  }))
}

export async function addCartItem(
  sessionId: string,
  productId: string,
  quantity = 1,
  selectedColor?: string,
  selectedStorage?: string,
  userId?: string
) {
  const cart = await findOrCreateCart(sessionId, userId)

  const existing = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.productId, productId),
      selectedColor ? eq(cartItems.selectedColor, selectedColor) : undefined,
      selectedStorage
        ? eq(cartItems.selectedStorage, selectedStorage)
        : undefined
    ),
  })

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id))
    return
  }

  await db.insert(cartItems).values({
    cartId: cart.id,
    productId,
    quantity,
    selectedColor,
    selectedStorage,
  })
}

export async function updateCartItemQuantity(
  sessionId: string,
  productId: string,
  quantity: number,
  userId?: string
) {
  const cart = await findOrCreateCart(sessionId, userId)
  await db
    .update(cartItems)
    .set({ quantity: Math.max(1, quantity) })
    .where(
      and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId))
    )
}

export async function removeCartItem(
  sessionId: string,
  productId: string,
  userId?: string
) {
  const cart = await findOrCreateCart(sessionId, userId)
  await db
    .delete(cartItems)
    .where(
      and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId))
    )
}

export async function clearCart(sessionId: string, userId?: string) {
  const cart = await findOrCreateCart(sessionId, userId)
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id))
}
