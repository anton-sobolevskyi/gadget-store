import type { CartItem } from "@/types/cart"
import type { PromoCodeType } from "@/db/schema"

export const FREE_SHIPPING_THRESHOLD = 50
export const STANDARD_SHIPPING = 10

export type AppliedPromoCode = {
  code: string
  type: PromoCodeType
  value: number
}

export function calculateDiscount(subtotal: number, promo?: AppliedPromoCode) {
  if (!promo || subtotal <= 0) return 0

  const discount =
    promo.type === "percent" ? (subtotal * promo.value) / 100 : promo.value

  return Math.min(Math.max(discount, 0), subtotal)
}

export function calculateOrderTotal(
  items: CartItem[],
  promo?: AppliedPromoCode
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
  const discount = calculateDiscount(subtotal, promo)

  return {
    subtotal,
    shipping,
    discount,
    total: subtotal - discount + shipping,
  }
}
