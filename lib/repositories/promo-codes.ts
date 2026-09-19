import { eq } from "drizzle-orm"

import { promoCodes, type PromoCodeType } from "@/db/schema"
import { db } from "@/lib/db"

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase()
}

export async function getPromoCodeByCode(code: string, executor = db) {
  return executor.query.promoCodes.findFirst({
    where: eq(promoCodes.code, normalizePromoCode(code)),
  })
}

export async function getPromoCodeById(id: string, executor = db) {
  return executor.query.promoCodes.findFirst({
    where: eq(promoCodes.id, id),
  })
}

export type PromoCodeInput = {
  code: string
  type: PromoCodeType
  value: number
  isActive?: boolean
}

export async function createPromoCode(input: PromoCodeInput) {
  const [promoCode] = await db
    .insert(promoCodes)
    .values({
      code: normalizePromoCode(input.code),
      type: input.type,
      value: input.value.toFixed(2),
      isActive: input.isActive ?? true,
    })
    .returning()
  return promoCode
}

export async function updatePromoCode(id: string, input: PromoCodeInput) {
  const [promoCode] = await db
    .update(promoCodes)
    .set({
      code: normalizePromoCode(input.code),
      type: input.type,
      value: input.value.toFixed(2),
      isActive: input.isActive ?? true,
      updatedAt: new Date(),
    })
    .where(eq(promoCodes.id, id))
    .returning()
  return promoCode
}

export async function setPromoCodeActive(id: string, isActive: boolean) {
  await db
    .update(promoCodes)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(promoCodes.id, id))
}

export async function deletePromoCode(id: string) {
  await db.delete(promoCodes).where(eq(promoCodes.id, id))
}

export async function getAllPromoCodes() {
  return db.query.promoCodes.findMany({
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  })
}
