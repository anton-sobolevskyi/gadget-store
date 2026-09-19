import type { Metadata } from "next"

import { ProductCard } from "@/app/components/product-card"
import { CatalogControls } from "./components/catalog-controls"
import { CatalogPagination } from "./components/catalog-pagination"
import { getCatalogProducts } from "@/lib/repositories/products"
import { parseCatalogQuery } from "@/lib/catalog-query"

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const metadata: Metadata = {
  title: "All Products | Gadget Hub",
  description: "Browse every gadget available at Gadget Hub.",
  alternates: { canonical: "/products" },
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const rawSearchParams = await searchParams
  const query = parseCatalogQuery(rawSearchParams)
  const result = await getCatalogProducts(query)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          All Products
        </h1>
        <p className="mt-2 text-gray-600" aria-live="polite">
          {result.total} product{result.total === 1 ? "" : "s"} found
        </p>

        <CatalogControls
          filters={{
            q: rawSearchParams.q?.toString(),
            category: rawSearchParams.category?.toString(),
            sort: rawSearchParams.sort?.toString(),
            minPrice: rawSearchParams.minPrice?.toString(),
            maxPrice: rawSearchParams.maxPrice?.toString(),
            inStock: rawSearchParams.inStock?.toString(),
          }}
        />

        {result.products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {result.products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              No products found
            </h2>
            <p className="mt-2 text-gray-600">
              Try changing your search or clearing some filters.
            </p>
          </div>
        )}

        <CatalogPagination
          page={result.page}
          pageCount={result.pageCount}
          searchParams={rawSearchParams}
        />
      </div>
    </div>
  )
}
