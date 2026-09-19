import Link from "next/link"

type CatalogPaginationProps = {
  page: number
  pageCount: number
  searchParams: Record<string, string | string[] | undefined>
}

export function CatalogPagination({
  page,
  pageCount,
  searchParams,
}: CatalogPaginationProps) {
  if (pageCount <= 1) return null

  function pageHref(value: number) {
    const params = new URLSearchParams()
    for (const [key, rawValue] of Object.entries(searchParams)) {
      if (typeof rawValue === "string" && rawValue) params.set(key, rawValue)
    }
    params.set("page", String(value))
    return `?${params.toString()}`
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-4"
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-md border px-4 py-2 text-sm text-gray-400">
          Previous
        </span>
      )}
      <span className="text-sm text-gray-600">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link
          href={pageHref(page + 1)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-md border px-4 py-2 text-sm text-gray-400">
          Next
        </span>
      )}
    </nav>
  )
}
