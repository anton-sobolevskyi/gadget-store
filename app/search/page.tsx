import type { Metadata } from "next"

import { searchProducts } from "@/lib/repositories/products"
import { ProductCard } from "@/app/components/product-card"

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Search results for "${q}" | Gadget Hub` : "Search | Gadget Hub",
    robots: { index: false },
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams
  const results = q ? await searchProducts(q) : []

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {q ? `Search results for "${q}"` : "Search products"}
      </h1>
      <p className="text-gray-600 mb-8" aria-live="polite">
        {q
          ? `${results.length} result${results.length === 1 ? "" : "s"} found`
          : "Enter a search term to find products."}
      </p>

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
