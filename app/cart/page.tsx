import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { getCartSessionId } from "@/lib/cart-session"
import { getCartState } from "@/lib/repositories/cart"
import Link from "next/link"
import { CartItems } from "./components/cart-items"
import { OrderSummary } from "./components/order-summary"

export default async function Cart() {
  const [session, sessionId] = await Promise.all([auth(), getCartSessionId()])
  const { items: cart, promoCode } = await getCartState(
    sessionId ?? "",
    session?.user?.id
  )
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {itemCount} item{itemCount === 1 ? "" : "s"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.length > 0 ? (
              <CartItems items={cart} />
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-6">
                  Add something from the catalog to get started.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            )}

            {/* Continue Shopping */}
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>

          {/* Order Summary */}
          <OrderSummary
            items={cart}
            promoCode={promoCode}
            isAuthenticated={Boolean(session?.user?.id && session.user.email)}
          />
        </div>
      </div>
    </div>
  )
}
