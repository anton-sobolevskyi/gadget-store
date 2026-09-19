import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { orderStatusValues, type OrderStatus } from "@/db/schema"
import { getOrdersPaginated } from "@/lib/repositories/orders"

const PAGE_SIZE = 20

function statusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case "paid":
    case "fulfilled":
      return "default"
    case "cancelled":
      return "destructive"
    default:
      return "secondary"
  }
}

type AdminOrdersPageProps = {
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = await searchParams
  const status = orderStatusValues.includes(params.status as OrderStatus)
    ? (params.status as OrderStatus)
    : undefined
  const page = Math.max(1, Number(params.page) || 1)

  const { orders, total } = await getOrdersPaginated({
    status,
    page,
    pageSize: PAGE_SIZE,
  })
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function pageHref(nextPage: number) {
    const query = new URLSearchParams()
    if (status) query.set("status", status)
    query.set("page", String(nextPage))
    return `/admin/orders?${query.toString()}`
  }

  function statusHref(nextStatus?: string) {
    const query = new URLSearchParams()
    if (nextStatus) query.set("status", nextStatus)
    return `/admin/orders?${query.toString()}`
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant={!status ? "default" : "outline"} size="sm" asChild>
          <Link href={statusHref()}>All</Link>
        </Button>
        {orderStatusValues.map(value => (
          <Button
            key={value}
            variant={status === value ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={statusHref(value)}>{value}</Link>
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="p-3 font-medium">Order</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="p-3 font-mono text-xs text-gray-600">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="p-3 text-gray-900">{order.email}</td>
                <td className="p-3">
                  <Badge variant={statusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="p-3 text-gray-600">
                  ${Number(order.total).toFixed(2)}
                </td>
                <td className="p-3 text-gray-600">
                  {order.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          {page <= 1 ? (
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={pageHref(page - 1)}>Previous</Link>
            </Button>
          )}
          {page >= totalPages ? (
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={pageHref(page + 1)}>Next</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
