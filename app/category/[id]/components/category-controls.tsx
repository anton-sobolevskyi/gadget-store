"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type CategoryControlsProps = {
  filters: {
    sort?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
  }
}

export function CategoryControls({ filters }: CategoryControlsProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilters(formData: FormData) {
    const params = new URLSearchParams(searchParams.toString())
    const entries = ["sort", "minPrice", "maxPrice", "inStock"] as const

    for (const name of entries) {
      const value = formData.get(name)
      if (value && value !== "false") {
        params.set(name, value.toString())
      } else {
        params.delete(name)
      }
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  function clearFilters() {
    router.push(pathname)
  }

  const hasFilters = Boolean(
    filters.sort || filters.minPrice || filters.maxPrice || filters.inStock
  )

  return (
    <form action={updateFilters} className="mb-8 border-y border-gray-200 py-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_160px_auto_auto] md:items-end">
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
        <label className="flex h-10 items-center gap-2 text-sm font-medium text-gray-900">
          <input
            type="checkbox"
            name="inStock"
            value="true"
            defaultChecked={filters.inStock === "true"}
          />
          In stock only
        </label>
        <div className="flex gap-2">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Apply
          </Button>
          {hasFilters && (
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
