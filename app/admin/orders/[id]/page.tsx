import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/db/schema"
import { getOrderById, getOrderItems } from "@/lib/repositories/orders"

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

type OrderDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) notFound()

  const items = await getOrderItems(order.id)

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Order #{order.id.slice(0, 8)}
      </h1>
      <p className="text-gray-500 mb-6">
        Placed {order.createdAt.toLocaleString()}
      </p>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="font-medium text-gray-900">{order.email}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Status</div>
          <Badge variant={statusBadgeVariant(order.status)}>
            {order.status}
          </Badge>
        </div>
        <div>
          <div className="text-sm text-gray-500">Total</div>
          <div className="font-medium text-gray-900">
            ${Number(order.total).toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Subtotal</div>
          <div className="font-medium text-gray-900">
            ${Number(order.subtotal).toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Discount</div>
          <div className="font-medium text-gray-900">
            {order.promoCode
              ? `${order.promoCode} (-$${Number(order.discount).toFixed(2)})`
              : "$0.00"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Shipping</div>
          <div className="font-medium text-gray-900">
            ${Number(order.shipping).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="p-3 font-medium">Item</th>
              <th className="p-3 font-medium">Options</th>
              <th className="p-3 font-medium">Qty</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-3 font-medium text-gray-900">{item.name}</td>
                <td className="p-3 text-gray-600">
                  {[item.selectedColor, item.selectedStorage]
                    .filter(Boolean)
                    .join(" / ") || "—"}
                </td>
                <td className="p-3 text-gray-600">{item.quantity}</td>
                <td className="p-3 text-gray-600">
                  ${Number(item.price).toFixed(2)}
                </td>
                <td className="p-3 text-gray-600">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
