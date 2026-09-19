import { count, eq, inArray, or } from "drizzle-orm"
import bcrypt from "bcryptjs"

import {
  carts,
  cartItems,
  orderItems,
  orders,
  products,
  users,
  type OrderStatus,
} from "@/db/schema"
import { normalizePhone } from "@/lib/customer"
import { db } from "@/lib/db"
import { calculateOrderTotal } from "@/lib/order-totals"
import type { CartItem } from "@/types/cart"

export async function createOrder(
  email: string,
  items: CartItem[],
  userId?: string
) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const [order] = await db
    .insert(orders)
    .values({ email, userId, total: total.toFixed(2) })
    .returning()

  if (items.length > 0) {
    await db.insert(orderItems).values(
      items.map(item => ({
        orderId: order.id,
        productId: item.id,
        name: item.name,
        price: item.price.toFixed(2),
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedStorage: item.selectedStorage,
      }))
    )
  }

  return order
}

export async function finalizeOrder({
  email,
  userId,
}: {
  email: string
  userId: string
}) {
  return db.transaction(async tx => {
    const cart = await tx.query.carts.findFirst({
      where: eq(carts.userId, userId),
    })

    if (!cart) throw new Error("Your cart is empty.")

    const rows = await tx
      .select({ item: cartItems, product: products })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id))

    if (rows.length === 0) throw new Error("Your cart is empty.")

    const items: CartItem[] = rows.map(({ item, product }) => ({
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
    const { total } = calculateOrderTotal(items)

    const [order] = await tx
      .insert(orders)
      .values({ email, userId, total: total.toFixed(2) })
      .returning()

    await tx.insert(orderItems).values(
      items.map(item => ({
        orderId: order.id,
        productId: item.id,
        name: item.name,
        price: item.price.toFixed(2),
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedStorage: item.selectedStorage,
      }))
    )

    await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id))

    return order
  })
}

export async function finalizeOrderForCustomer({
  phone,
  password,
  sessionId,
}: {
  phone: string
  password: string
  sessionId: string
}) {
  const normalizedPhone = normalizePhone(phone)
  if (normalizedPhone.length < 7 || password.length < 8) {
    throw new Error(
      "Enter a valid phone number and a password of at least 8 characters."
    )
  }

  return db.transaction(async tx => {
    let user = await tx.query.users.findFirst({
      where: eq(users.phone, normalizedPhone),
    })

    if (user) {
      if (
        !user.passwordHash ||
        !(await bcrypt.compare(password, user.passwordHash))
      ) {
        throw new Error("The phone number or password is incorrect.")
      }
    } else {
      const [createdUser] = await tx
        .insert(users)
        .values({
          phone: normalizedPhone,
          email: `${normalizedPhone.replace(/\D/g, "")}@customers.gadget-store.local`,
          passwordHash: await bcrypt.hash(password, 12),
          role: "customer",
        })
        .returning()
      user = createdUser
    }

    const customerCarts = await tx.query.carts.findMany({
      where: or(eq(carts.sessionId, sessionId), eq(carts.userId, user.id)),
    })
    const cartIds = customerCarts.map(cart => cart.id)
    if (cartIds.length === 0) throw new Error("Your cart is empty.")

    const rows = await tx
      .select({ item: cartItems, product: products })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(inArray(cartItems.cartId, cartIds))

    if (rows.length === 0) throw new Error("Your cart is empty.")

    const items: CartItem[] = rows.map(({ item, product }) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      images: product.images,
      category: product.category,
      rating: Number(product.rating),
      reviews: product.reviews,
      inStock: product.inStock,
      description: product.description,
      specifications: product.specifications,
      quantity: item.quantity,
      selectedColor: item.selectedColor ?? undefined,
      selectedStorage: item.selectedStorage ?? undefined,
    }))
    const { total } = calculateOrderTotal(items)
    const [order] = await tx
      .insert(orders)
      .values({
        email: user.email ?? `${normalizedPhone}@customers.gadget-store.local`,
        userId: user.id,
        total: total.toFixed(2),
      })
      .returning()

    await tx.insert(orderItems).values(
      items.map(item => ({
        orderId: order.id,
        productId: item.id,
        name: item.name,
        price: item.price.toFixed(2),
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedStorage: item.selectedStorage,
      }))
    )
    await tx.delete(cartItems).where(inArray(cartItems.cartId, cartIds))

    return { order, user }
  })
}

export async function getOrdersForUser(userId: string) {
  return db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
  })
}

export async function getOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
  })
}

export async function getOrderItems(orderId: string) {
  return db.query.orderItems.findMany({
    where: eq(orderItems.orderId, orderId),
  })
}

export async function getOrdersPaginated({
  status,
  page = 1,
  pageSize = 20,
}: {
  status?: OrderStatus
  page?: number
  pageSize?: number
}) {
  const where = status ? eq(orders.status, status) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db.query.orders.findMany({
      where,
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    db.select({ total: count() }).from(orders).where(where),
  ])

  return { orders: rows, total: Number(total), page, pageSize }
}
