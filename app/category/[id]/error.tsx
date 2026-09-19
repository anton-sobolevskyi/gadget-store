"use client"

import { Button } from "@/components/ui/button"

export default function CategoryError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        We couldn&apos;t load this category
      </h1>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
