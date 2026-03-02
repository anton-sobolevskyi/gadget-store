import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CartItems } from "./components/cart-items"
import { OrderSummary } from "./components/order-summary"

export default function Cart() {
  // const cart = useStore(state => state.cart)

  // if (cart.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  //       <div className="text-center max-w-md">
  //         <div className="mb-6">
  //           <ShoppingBag className="w-24 h-24 mx-auto text-gray-300" />
  //         </div>
  //         <h2 className="text-3xl font-bold text-gray-900 mb-4">
  //           Your Cart is Empty
  //         </h2>
  //         <p className="text-gray-600 mb-8">
  //           Looks like you haven&apos;t added anything to your cart yet. Start
  //           shopping to find amazing gadgets!
  //         </p>
  //         <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
  //           <Link href="/">
  //             Continue Shopping
  //             <ChevronRight className="ml-2 w-4 h-4" />
  //           </Link>
  //         </Button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">0 items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <CartItems />

            {/* Continue Shopping */}
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>

          {/* Order Summary */}
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
