"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PromoCode } from "@/db/schema"

export function PromoCodeForm({
  promoCode,
  action,
}: {
  promoCode?: PromoCode
  action: (formData: FormData) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => action(formData))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="code" className="mb-1 block text-sm font-medium">
          Code
        </label>
        <Input
          id="code"
          name="code"
          defaultValue={promoCode?.code}
          placeholder="WELCOME10"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium">
            Discount type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={promoCode?.type ?? "percent"}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="percent">Percent</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </div>
        <div>
          <label htmlFor="value" className="mb-1 block text-sm font-medium">
            Value
          </label>
          <Input
            id="value"
            name="value"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={promoCode ? Number(promoCode.value) : undefined}
            required
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={promoCode?.isActive ?? true}
          className="size-4"
        />
        Active
      </label>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save promo code"}
      </Button>
    </form>
  )
}
