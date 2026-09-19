"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { normalizePhone } from "@/lib/customer"
import { updateUserProfile } from "@/lib/repositories/users"

const profileSchema = z.object({
  name: z.string().trim().max(100, "Name is too long."),
  phone: z
    .string()
    .trim()
    .refine(
      value => !value || normalizePhone(value).replace(/\D/g, "").length >= 7,
      "Enter a valid phone number."
    ),
})

export type ProfileActionState = {
  error?: string
  success?: boolean
}

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account")
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid profile data." }
  }

  try {
    await updateUserProfile({
      userId: session.user.id,
      name: parsed.data.name || null,
      phone: parsed.data.phone ? normalizePhone(parsed.data.phone) : null,
    })
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to update profile.",
    }
  }

  revalidatePath("/account")
  return { success: true }
}
