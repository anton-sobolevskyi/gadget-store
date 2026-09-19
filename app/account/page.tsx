import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { getUserById } from "@/lib/repositories/users"

import { ProfileForm } from "./components/profile-form"

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login?callbackUrl=/account")

  const user = await getUserById(session.user.id)
  if (!user) redirect("/login?callbackUrl=/account")

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-blue-600">Account</p>
            <h1 className="text-3xl font-bold text-gray-900">Your profile</h1>
            <p className="mt-2 text-gray-600">
              Keep your contact details up to date.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/account/orders">View orders</Link>
          </Button>
        </div>

        <section className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
          <ProfileForm
            name={user.name ?? ""}
            email={user.email ?? session.user.email ?? ""}
            phone={user.phone ?? ""}
          />
        </section>
      </div>
    </div>
  )
}
