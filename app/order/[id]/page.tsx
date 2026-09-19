import { notFound, redirect } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { getOrderById, getOrderItems } from "@/lib/repositories/orders"
import Link from "next/link"

type OrderPageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login?callbackUrl=/cart")

  const { id } = await params
  const order = await getOrderById(id)
  if (!order || order.userId !== session.user.id) notFound()

  const items = await getOrderItems(order.id)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white border border-gray-200 p-6 md:p-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            Order confirmed
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanks for your order
          </h1>
          <p className="text-gray-600 mb-6">
            Order #{order.id.slice(0, 8)} was placed for {order.email}.
          </p>

          <div className="flex items-center justify-between border-y border-gray-200 py-4 mb-6">
            <span className="text-gray-600">Status</span>
            <Badge>{order.status}</Badge>
          </div>

          <div className="space-y-4 mb-8">
            {items.map(item => (
              <div key={item.id} className="flex justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x ${Number(item.price).toFixed(2)}
                    {[item.selectedColor, item.selectedStorage]
                      .filter(Boolean)
                      .map(option => ` / ${option}`)
                      .join("")}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t border-gray-200 pt-4 text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>

          <Button asChild className="mt-8 bg-blue-600 hover:bg-blue-700">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
