import { createPromoCodeAction } from "../actions"
import { PromoCodeForm } from "../components/promo-code-form"

export default function NewPromoCodePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New promo code</h1>
      <PromoCodeForm action={createPromoCodeAction} />
    </div>
  )
}
