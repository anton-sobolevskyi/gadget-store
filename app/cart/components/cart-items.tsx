"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { useStore } from "@/hooks/useStore"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

function CartItems() {
  const cart = useStore(state => state.cart)
  const removeFromCart = useStore(state => state.removeFromCart)
  const updateQuantity = useStore(state => state.updateQuantity)

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId)
    toast.success(`${productName} removed from cart`)
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity)
    }
  }

  return cart.map(item => (
    <Card
      key={`${item.id}-${item.selectedColor}-${item.selectedStorage}`}
      className="border-none shadow-md"
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-4">
          {/* Image */}
          <Link
            href={`/product/${item.id}`}
            className="shrink-0 w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-lg overflow-hidden"
          >
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              width={120}
              height={120}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </Link>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link
                  href={`/product/${item.id}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                {(item.selectedColor || item.selectedStorage) && (
                  <p className="text-sm text-gray-600 mt-1">
                    {item.selectedColor && `Color: ${item.selectedColor}`}
                    {item.selectedColor && item.selectedStorage && " • "}
                    {item.selectedStorage && `Storage: ${item.selectedStorage}`}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-500 -mt-2"
                onClick={() => handleRemove(item.id, item.name)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4">
              {/* Quantity */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">${item.price} each</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ))
}

export { CartItems }
