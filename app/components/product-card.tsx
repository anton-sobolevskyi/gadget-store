"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { PriceDisplay } from "@/components/ui/price-display"
import { RatingStars } from "@/components/ui/rating-stars"
import { addToCartAction } from "@/app/cart/actions"
import { useStore } from "@/hooks/useStore"
import { Product } from "@/types/product"
import { Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const wishlist = useStore(state => state.wishlist)
  const toggleWishlist = useStore(state => state.toggleWishlist)
  const isInWishlist = wishlist.includes(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    await addToCartAction(product.id)
    router.refresh()
    toast.success(`${product.name} added to cart!`)
  }

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0

  return (
    <Card className="group relative h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <Link href={`/product/${product.id}`}>
        <CardContent className="p-4">
          {/* Image */}
          <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
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
          <RatingStars rating={product.rating} reviews={product.reviews} />

          {/* Price */}
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            className="mb-3"
          />
        </CardContent>
      </Link>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute left-6 top-6 z-10 bg-white/90"
        aria-label={
          isInWishlist
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        aria-pressed={isInWishlist}
        onClick={() => {
          toggleWishlist(product.id)
          toast.success(
            isInWishlist ? "Removed from wishlist" : "Added to wishlist"
          )
        }}
      >
        <Heart
          className={`w-4 h-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
          aria-hidden="true"
        />
      </Button>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  )
}
