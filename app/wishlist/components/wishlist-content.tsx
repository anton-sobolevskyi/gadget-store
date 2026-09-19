"use client"

import Link from "next/link"

import { ProductCard } from "@/app/components/product-card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/hooks/useStore"
import type { Product } from "@/types/product"

export function WishlistContent({ products }: { products: Product[] }) {
  const wishlist = useStore(state => state.wishlist)
  const hasHydrated = useStore(state => state.hasHydrated)

  if (!hasHydrated) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-12 md:px-6">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Wishlist
        </h1>
        <p className="mt-4 text-gray-600">Loading saved products...</p>
      </div>
    )
  }

  const savedProducts = products.filter(product =>
    wishlist.includes(product.id)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Wishlist
        </h1>
        <p className="mt-2 text-gray-600" aria-live="polite">
          {savedProducts.length} saved product
          {savedProducts.length === 1 ? "" : "s"}
        </p>

        {savedProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {savedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-gray-600">
              Save products to compare or revisit them later.
            </p>
            <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/">Explore products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
