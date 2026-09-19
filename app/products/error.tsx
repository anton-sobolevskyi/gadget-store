"use client"

import { Button } from "@/components/ui/button"

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        We couldn&apos;t load the catalog
      </h1>
      <p className="mt-2 text-gray-600">Please try again in a moment.</p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
