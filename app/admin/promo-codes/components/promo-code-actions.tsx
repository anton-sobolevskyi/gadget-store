"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"

export function PromoCodeActions({
  id,
  isActive,
  toggleAction,
  deleteAction,
}: {
  id: string
  isActive: boolean
  toggleAction: (id: string, isActive: boolean) => Promise<void>
  deleteAction: (id: string) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => startTransition(() => toggleAction(id, !isActive))}
      >
        {isActive ? "Deactivate" : "Activate"}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (window.confirm("Delete this promo code?")) {
            startTransition(() => deleteAction(id))
          }
        }}
      >
        Delete
      </Button>
    </div>
  )
}
