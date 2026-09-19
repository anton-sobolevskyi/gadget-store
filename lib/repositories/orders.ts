import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { orderItems, orders } from "@/db/schema"
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
