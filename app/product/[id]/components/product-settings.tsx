"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStore } from "@/hooks/useStore"
import { Product } from "@/types/product"
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

function ProductSettings({ product }: { product: Product }) {
  const addToCart = useStore(state => state.addToCart)
  const toggleWishlist = useStore(state => state.toggleWishlist)
  const wishlist = useStore(state => state.wishlist)

  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>()
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>()

  const isInWishlist = wishlist.includes(product.id)

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedStorage)
    toast.success(`${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedStorage)
    window.location.href = "/cart"
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product.id)
    toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist")
  }

  return (
    <>
      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Color: {selectedColor || "Select"}
          </label>
          <div className="flex gap-3">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedColor === color
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.storage && product.storage.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Storage
          </label>
          <Select value={selectedStorage} onValueChange={setSelectedStorage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select storage" />
            </SelectTrigger>
            <SelectContent>
              {product.storage.map(storage => (
                <SelectItem key={storage} value={storage}>
                  {storage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Badge
            variant={product.inStock ? "default" : "destructive"}
            className="bg-green-500"
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          size="lg"
          className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 h-12"
          onClick={handleBuyNow}
          disabled={!product.inStock}
        >
          Buy Now
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12"
          onClick={handleToggleWishlist}
        >
          <Heart
            className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold">${product.price}</div>
          </div>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </>
  )
}

export { ProductSettings }
