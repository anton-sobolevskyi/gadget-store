import { and, eq, isNull } from "drizzle-orm"

import { db } from "@/lib/db"
import { cartItems, carts, products } from "@/db/schema"
import type { CartItem } from "@/types/cart"
import {
  getPromoCodeByCode,
  getPromoCodeById,
} from "@/lib/repositories/promo-codes"

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

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
  const state = await getCartState(sessionId, userId)
  return state.items
}

export async function getCartState(sessionId: string, userId?: string) {
  const cart = await findOrCreateCart(sessionId, userId)

  const rows = await db
    .select({ item: cartItems, product: products })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id))

  const items = rows.map(({ item, product }) => ({
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

  const storedPromoCode = cart.promoCodeId
    ? await getPromoCodeById(cart.promoCodeId)
    : undefined
  const promoCode = storedPromoCode?.isActive ? storedPromoCode : undefined

  return { items, promoCode }
}

export async function applyPromoCode(
  sessionId: string,
  code: string,
  userId?: string
) {
  const cart = await findOrCreateCart(sessionId, userId)
  const promoCode = await getPromoCodeByCode(code)

  if (!promoCode || !promoCode.isActive) {
    throw new Error("This promo code is invalid or inactive.")
  }

  await db
    .update(carts)
    .set({ promoCodeId: promoCode.id, updatedAt: new Date() })
    .where(eq(carts.id, cart.id))

  return promoCode
}

export async function removePromoCode(sessionId: string, userId?: string) {
  const cart = await findOrCreateCart(sessionId, userId)
  await db
    .update(carts)
    .set({ promoCodeId: null, updatedAt: new Date() })
    .where(eq(carts.id, cart.id))
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
  await db
    .update(carts)
    .set({ promoCodeId: null, updatedAt: new Date() })
    .where(eq(carts.id, cart.id))
}

// Folds a guest's session-keyed cart into their account cart after login/checkout.
export async function mergeGuestCartIntoUser(
  sessionId: string,
  userId: string
) {
  await db.transaction(tx => mergeGuestCartIntoUserTx(tx, sessionId, userId))
}

export async function mergeGuestCartIntoUserTx(
  tx: Tx,
  sessionId: string,
  userId: string
) {
  const guestCart = await tx.query.carts.findFirst({
    where: and(eq(carts.sessionId, sessionId), isNull(carts.userId)),
  })
  if (!guestCart) return

  const userCart = await tx.query.carts.findFirst({
    where: eq(carts.userId, userId),
  })

  if (!userCart) {
    await tx.update(carts).set({ userId }).where(eq(carts.id, guestCart.id))
    return
  }

  if (!userCart.promoCodeId && guestCart.promoCodeId) {
    await tx
      .update(carts)
      .set({ promoCodeId: guestCart.promoCodeId })
      .where(eq(carts.id, userCart.id))
  }

  const guestItems = await tx.query.cartItems.findMany({
    where: eq(cartItems.cartId, guestCart.id),
  })

  for (const guestItem of guestItems) {
    const existing = await tx.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, userCart.id),
        eq(cartItems.productId, guestItem.productId),
        guestItem.selectedColor
          ? eq(cartItems.selectedColor, guestItem.selectedColor)
          : undefined,
        guestItem.selectedStorage
          ? eq(cartItems.selectedStorage, guestItem.selectedStorage)
          : undefined
      ),
    })

    if (existing) {
      await tx
        .update(cartItems)
        .set({ quantity: existing.quantity + guestItem.quantity })
        .where(eq(cartItems.id, existing.id))
    } else {
      await tx.insert(cartItems).values({
        cartId: userCart.id,
        productId: guestItem.productId,
        quantity: guestItem.quantity,
        selectedColor: guestItem.selectedColor,
        selectedStorage: guestItem.selectedStorage,
      })
    }
  }

  await tx.delete(carts).where(eq(carts.id, guestCart.id))
}
