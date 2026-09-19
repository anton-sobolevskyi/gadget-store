"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { calculateOrderTotal } from "@/lib/order-totals"
import {
  applyPromoCodeAction,
  finalizeOrderAction,
  removePromoCodeAction,
} from "../actions"
import type { PromoCode } from "@/db/schema"
import type { CartItem } from "@/types/cart"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

function OrderSummary({
  items,
  promoCode,
  isAuthenticated,
}: {
  items: CartItem[]
  promoCode?: PromoCode
  isAuthenticated: boolean
}) {
  const router = useRouter()
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [promoInput, setPromoInput] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const appliedPromo = promoCode
    ? {
        code: promoCode.code,
        type: promoCode.type,
        value: Number(promoCode.value),
      }
    : undefined
  const { subtotal, shipping, discount, total } = calculateOrderTotal(
    items,
    appliedPromo
  )

  const handleApplyPromo = async () => {
    setError(null)
    setIsApplyingPromo(true)
    try {
      await applyPromoCodeAction(promoInput)
      setPromoInput("")
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to apply promo code."
      setError(message)
      toast.error(message)
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleFinalize = async () => {
    setError(null)
    setIsFinalizing(true)
    try {
      const orderId = await finalizeOrderAction()
      router.push(`/order/${orderId}`)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to finalize your order."
      setError(message)
      toast.error(message)
    } finally {
      setIsFinalizing(false)
    }
  }

  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Promo Code
            </label>
            {promoCode ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                <span className="text-sm font-semibold text-green-700">
                  {promoCode.code} applied
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await removePromoCodeAction()
                    router.refresh()
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  className="flex-1"
                  value={promoInput}
                  onChange={event => setPromoInput(event.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleApplyPromo}
                  disabled={!promoInput.trim() || isApplyingPromo}
                >
                  {isApplyingPromo ? "Applying..." : "Apply"}
                </Button>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Price Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span className="font-semibold">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            {subtotal < 50 && shipping > 0 && (
              <p className="text-sm text-gray-600">
                Add ${(50 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
          </div>

          <Separator className="my-6" />

          {/* Total */}
          <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          {isAuthenticated ? (
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
              onClick={handleFinalize}
              disabled={items.length === 0 || isFinalizing}
            >
              {isFinalizing ? "Finalizing..." : "Finalize Order"}
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={event => setEmail(event.target.value)}
                autoComplete="email"
              />
              <Input
                type="password"
                placeholder="Password (8+ characters)"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="new-password"
              />
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
                onClick={async () => {
                  setError(null)
                  setIsFinalizing(true)
                  try {
                    await finalizeOrderAction(email, password)
                  } catch (error) {
                    const message =
                      error instanceof Error
                        ? error.message
                        : "Unable to finalize your order."
                    setError(message)
                    toast.error(message)
                    setIsFinalizing(false)
                  }
                }}
                disabled={items.length === 0 || isFinalizing}
              >
                {isFinalizing
                  ? "Creating order..."
                  : "Create account and order"}
              </Button>
            </div>
          )}

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure Checkout</span>
          </div>
        </CardContent>
      </Card>

      {/* Mini Upsell */}
      <Card className="mt-6 border-none shadow-md bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Need Accessories?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Complete your setup with cases, chargers, and more!
          </p>
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href="/category/accessories">Browse Accessories</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export { OrderSummary }
