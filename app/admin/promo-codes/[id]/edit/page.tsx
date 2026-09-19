import { notFound } from "next/navigation"

import { getPromoCodeById } from "@/lib/repositories/promo-codes"

import { updatePromoCodeAction } from "../../actions"
import { PromoCodeForm } from "../../components/promo-code-form"

export default async function EditPromoCodePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const promoCode = await getPromoCodeById(id)
  if (!promoCode) notFound()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit promo code</h1>
      <PromoCodeForm
        promoCode={promoCode}
        action={updatePromoCodeAction.bind(null, promoCode.id)}
      />
    </div>
  )
}
