import Link from "next/link"
import { redirect } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { OrderStatus } from "@/db/schema"
import { auth } from "@/lib/auth"
import { getOrdersForUser } from "@/lib/repositories/orders"

function statusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case "paid":
    case "fulfilled":
      return "default" as const
    case "cancelled":
      return "destructive" as const
    default:
      return "secondary" as const
  }
}

export default async function AccountOrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/orders")

  const orders = await getOrdersForUser(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-blue-600">Account</p>
            <h1 className="text-3xl font-bold text-gray-900">Your orders</h1>
            <p className="mt-2 text-gray-600">
              Review your previous purchases.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/account">Back to profile</Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              No orders yet
            </h2>
            <p className="mb-6 text-gray-600">
              Your completed purchases will appear here.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/products">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Placed</th>
                  <th className="p-4 font-medium">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="p-4 font-mono text-xs text-gray-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="p-4">
                      <Badge variant={statusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/order/${order.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
