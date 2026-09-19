"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"

export function DeleteProductButton({
  productId,
  action,
}: {
  productId: string
  action: (id: string) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this product? This cannot be undone.")) return
        startTransition(() => action(productId))
      }}
    >
      {isPending ? "Deleting…" : "Delete"}
    </Button>
  )
}
