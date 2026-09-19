import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllPromoCodes } from "@/lib/repositories/promo-codes"

import { deletePromoCodeAction, togglePromoCodeAction } from "./actions"
import { PromoCodeActions } from "./components/promo-code-actions"

export default async function AdminPromoCodesPage() {
  const promoCodes = await getAllPromoCodes()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Promo codes</h1>
        <Button asChild>
          <Link href="/admin/promo-codes/new">New promo code</Link>
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="p-3 font-medium">Code</th>
              <th className="p-3 font-medium">Discount</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map(promoCode => (
              <tr key={promoCode.id} className="border-b last:border-0">
                <td className="p-3 font-mono font-medium text-gray-900">
                  <Link
                    href={`/admin/promo-codes/${promoCode.id}/edit`}
                    className="hover:text-blue-600"
                  >
                    {promoCode.code}
                  </Link>
                </td>
                <td className="p-3 text-gray-600">
                  {promoCode.type === "percent"
                    ? `${promoCode.value}%`
                    : `$${Number(promoCode.value).toFixed(2)}`}
                </td>
                <td className="p-3">
                  <Badge variant={promoCode.isActive ? "default" : "secondary"}>
                    {promoCode.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-3 text-gray-600">
                  {promoCode.createdAt.toLocaleDateString()}
                </td>
                <td className="p-3">
                  <PromoCodeActions
                    id={promoCode.id}
                    isActive={promoCode.isActive}
                    toggleAction={togglePromoCodeAction}
                    deleteAction={deletePromoCodeAction}
                  />
                </td>
              </tr>
            ))}
            {promoCodes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No promo codes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
