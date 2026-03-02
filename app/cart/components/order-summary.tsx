"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/hooks/useStore"
import Link from "next/link"
import { toast } from "sonner"

function OrderSummary() {
  const getCartTotal = useStore(state => state.getCartTotal())

  const subtotal = getCartTotal
  const shipping = subtotal > 50 ? 0 : 10
  const total = subtotal + shipping

  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          {/* Promo Code */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Promo Code
            </label>
            <div className="flex gap-2">
              <Input placeholder="Enter code" className="flex-1" />
              <Button variant="outline">Apply</Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Price Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
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
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
            onClick={() => toast.success("Checkout feature coming soon!")}
          >
            Proceed to Checkout
          </Button>

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
