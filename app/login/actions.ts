"use server"

import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

import { signIn } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"))

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        `/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(callbackUrl)}`
      )
    }
    throw error
  }
}

function getSafeCallbackUrl(value: FormDataEntryValue | null) {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
    ? value
    : "/"
}
