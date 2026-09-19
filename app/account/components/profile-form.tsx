"use client"

import { useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { updateProfileAction, type ProfileActionState } from "../actions"

type ProfileFormProps = {
  name: string
  email: string
  phone: string
}

const initialState: ProfileActionState = {}

export function ProfileForm({ name, email, phone }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  )

  useEffect(() => {
    if (state.success) {
      const timeout = window.setTimeout(() => window.location.reload(), 1200)
      return () => window.clearTimeout(timeout)
    }
  }, [state.success])

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Name
        </label>
        <Input id="name" name="name" defaultValue={name} autoComplete="name" />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <Input id="email" value={email} disabled />
        <p className="mt-1 text-sm text-gray-500">
          Email cannot be changed here.
        </p>
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium">
          Phone
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={phone}
          autoComplete="tel"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-green-600">
          Profile updated.
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  )
}
