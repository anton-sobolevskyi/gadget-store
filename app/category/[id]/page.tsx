import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

import { ProductCard } from "@/app/components/product-card"
import { CatalogPagination } from "@/app/products/components/catalog-pagination"
import { Button } from "@/components/ui/button"
import { getCategoryById } from "@/data/products"
import { parseCatalogQuery } from "@/lib/catalog-query"
import { getCatalogProducts } from "@/lib/repositories/products"
import { CategoryControls } from "./components/category-controls"

type CategoryPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    q?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
  }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { id } = await params
  const category = getCategoryById(id)

  if (!category) {
    return { title: "Category not found" }
  }

  return {
    title: `${category.name} | Gadget Hub`,
    description: `Shop the latest ${category.name.toLowerCase()} at Gadget Hub.`,
    alternates: { canonical: `/category/${category.id}` },
    openGraph: {
      title: `${category.name} | Gadget Hub`,
      description: `Shop the latest ${category.name.toLowerCase()} at Gadget Hub.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Gadget Hub`,
      description: `Shop the latest ${category.name.toLowerCase()} at Gadget Hub.`,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { id } = await params
  const rawSearchParams = await searchParams
  const category = getCategoryById(id)

  if (!category) notFound()

  const query = parseCatalogQuery({
    ...rawSearchParams,
    category: category.name,
  })
  const result = await getCatalogProducts(query)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span aria-current="page" className="text-gray-900">
              {category.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <p className="mb-2 text-4xl" aria-hidden="true">
            {category.icon}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 text-gray-600" aria-live="polite">
            {result.total} product{result.total === 1 ? "" : "s"} found
          </p>
        </div>

        <CategoryControls
          filters={{
            sort: rawSearchParams.sort,
            minPrice: rawSearchParams.minPrice,
            maxPrice: rawSearchParams.maxPrice,
            inStock: rawSearchParams.inStock,
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
              No products in this category yet
            </h2>
            <p className="mt-2 text-gray-600">
              Explore another category while we add new products.
            </p>
            <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/">Browse categories</Link>
            </Button>
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
