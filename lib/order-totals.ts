import type { CartItem } from "@/types/cart"

export const FREE_SHIPPING_THRESHOLD = 50
export const STANDARD_SHIPPING = 10

export function calculateOrderTotal(items: CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING

  return { subtotal, shipping, total: subtotal + shipping }
}
