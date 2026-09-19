"use server"

import { randomUUID } from "crypto"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { requireAdmin } from "@/lib/authz"
import { getPublicUrl, getUploadUrl } from "@/lib/r2"
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/repositories/products"

const productSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  originalPrice: z.coerce.number().positive().optional(),
  image: z.string().min(1),
  images: z.array(z.string().min(1)).optional(),
  category: z.string().min(1),
  description: z.string().min(1),
  specifications: z.record(z.string(), z.string()),
  colors: z.array(z.string().min(1)).optional(),
  storage: z.array(z.string().min(1)).optional(),
  inStock: z.boolean(),
})

function parseSpecifications(raw: string): Record<string, string> {
  const specifications: Record<string, string> = {}
  for (const line of raw.split("\n")) {
    const [key, ...rest] = line.split(":")
    const value = rest.join(":").trim()
    if (key.trim() && value) specifications[key.trim()] = value
  }
  return specifications
}

function parseCommaList(raw: string): string[] | undefined {
  const values = raw
    .split(",")
    .map(value => value.trim())
    .filter(Boolean)
  return values.length > 0 ? values : undefined
}

function parseProductForm(formData: FormData) {
  return productSchema.parse({
    name: formData.get("name"),
    price: formData.get("price"),
    originalPrice: formData.get("originalPrice") || undefined,
    image: formData.get("image"),
    images: parseCommaList(String(formData.get("images") ?? "")),
    category: formData.get("category"),
    description: formData.get("description"),
    specifications: parseSpecifications(
      String(formData.get("specifications") ?? "")
    ),
    colors: parseCommaList(String(formData.get("colors") ?? "")),
    storage: parseCommaList(String(formData.get("storage") ?? "")),
    inStock: formData.get("inStock") === "on",
  })
}

export async function createProductAction(formData: FormData) {
  await requireAdmin()
  const input = parseProductForm(formData)
  await createProduct(input)
  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin()
  const input = parseProductForm(formData)
  await updateProduct(id, input)
  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function deleteProductAction(id: string) {
  await requireAdmin()
  await deleteProduct(id)
  revalidatePath("/admin/products")
}

export async function getProductUploadUrlAction(
  fileName: string,
  contentType: string
) {
  await requireAdmin()
  const key = `products/${randomUUID()}-${fileName}`
  const uploadUrl = await getUploadUrl(key, contentType)
  const publicUrl = getPublicUrl(key)
  return { uploadUrl, publicUrl }
}
