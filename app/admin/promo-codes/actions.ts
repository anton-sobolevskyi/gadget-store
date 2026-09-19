"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { requireAdmin } from "@/lib/authz"
import {
  createPromoCode,
  deletePromoCode,
  setPromoCodeActive,
  updatePromoCode,
} from "@/lib/repositories/promo-codes"

const promoCodeSchema = z
  .object({
    code: z.string().trim().min(1).max(50),
    type: z.enum(["percent", "fixed"]),
    value: z.coerce.number().positive(),
    isActive: z.boolean(),
  })
  .superRefine((input, context) => {
    if (input.type === "percent" && input.value > 100) {
      context.addIssue({
        code: "custom",
        path: ["value"],
        message: "Percent discounts cannot exceed 100.",
      })
    }
  })

function parsePromoCodeForm(formData: FormData) {
  return promoCodeSchema.parse({
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    isActive: formData.get("isActive") === "on",
  })
}

export async function createPromoCodeAction(formData: FormData) {
  await requireAdmin()
  await createPromoCode(parsePromoCodeForm(formData))
  revalidatePath("/admin/promo-codes")
  redirect("/admin/promo-codes")
}

export async function updatePromoCodeAction(id: string, formData: FormData) {
  await requireAdmin()
  await updatePromoCode(id, parsePromoCodeForm(formData))
  revalidatePath("/admin/promo-codes")
  redirect("/admin/promo-codes")
}

export async function togglePromoCodeAction(id: string, isActive: boolean) {
  await requireAdmin()
  await setPromoCodeActive(id, isActive)
  revalidatePath("/admin/promo-codes")
}

export async function deletePromoCodeAction(id: string) {
  await requireAdmin()
  await deletePromoCode(id)
  revalidatePath("/admin/promo-codes")
}
