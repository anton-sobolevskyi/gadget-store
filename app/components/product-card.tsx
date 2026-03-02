"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { useStore } from "@/hooks/useStore"
import { Product } from "@/types/product"
import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore(state => state.addToCart)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    toast.success(`${product.name} added to cart!`)
  }

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-4">
          {/* Image */}
          <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {discountPercent > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                Save {discountPercent}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge className="absolute top-2 left-2 bg-gray-900">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Category */}
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
