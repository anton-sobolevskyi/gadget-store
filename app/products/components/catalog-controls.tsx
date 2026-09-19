"use client"

import { categories } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type CatalogControlsProps = {
  filters: {
    q?: string
    category?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
  }
}

export function CatalogControls({ filters }: CatalogControlsProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilters(formData: FormData) {
    const params = new URLSearchParams(searchParams.toString())
    const entries = [
      "q",
      "category",
      "sort",
      "minPrice",
      "maxPrice",
      "inStock",
    ] as const

    for (const name of entries) {
      const value = formData.get(name)?.toString().trim()
      if (value && value !== "false") {
        params.set(name, value)
      } else {
        params.delete(name)
      }
    }
    params.delete("page")

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  function clearFilters() {
    router.push(pathname)
  }

  const activeFilters = [
    filters.q ? `Search: ${filters.q}` : null,
    filters.category ? `Category: ${filters.category}` : null,
    filters.minPrice ? `From: $${filters.minPrice}` : null,
    filters.maxPrice ? `To: $${filters.maxPrice}` : null,
    filters.inStock === "true" ? "In stock" : null,
    filters.sort ? `Sort: ${filters.sort}` : null,
  ].filter(Boolean) as string[]

  return (
    <div className="mb-8 border-y border-gray-200 py-4">
      <form action={updateFilters}>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_150px_150px] md:items-end">
          <label className="grid gap-2 text-sm font-medium text-gray-900">
            Search products
            <Input name="q" type="search" defaultValue={filters.q} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-900">
            Category
            <select
              name="category"
              defaultValue={filters.category ?? ""}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            >
              <option value="">All categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-900">
            Sort by
            <select
              name="sort"
              defaultValue={filters.sort ?? ""}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            >
              <option value="">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating-desc">Highest rated</option>
            </select>
          </label>
          <div className="flex items-center gap-3 md:h-10">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <input
                type="checkbox"
                name="inStock"
                value="true"
                defaultChecked={filters.inStock === "true"}
              />
              In stock
            </label>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[160px_160px_auto] sm:items-end">
          <label className="grid gap-2 text-sm font-medium text-gray-900">
            Minimum price
            <Input
              name="minPrice"
              type="number"
              min="0"
              step="1"
              defaultValue={filters.minPrice}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-900">
            Maximum price
            <Input
              name="maxPrice"
              type="number"
              min="0"
              step="1"
              defaultValue={filters.maxPrice}
            />
          </label>
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Apply filters
            </Button>
            {activeFilters.length > 0 && (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
        </div>
      </form>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
          {activeFilters.map(filter => (
            <span
              key={filter}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800"
            >
              {filter}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
