import type { Metadata } from "next"

import { ProductCard } from "@/app/components/product-card"
import { getAllProducts } from "@/lib/repositories/products"

export const metadata: Metadata = {
  title: "All Products | Gadget Hub",
  description: "Browse every gadget available at Gadget Hub.",
  alternates: { canonical: "/products" },
}

export default async function ProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          All Products
        </h1>
        <p className="mt-2 text-gray-600">
          {products.length} product{products.length === 1 ? "" : "s"} available
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
