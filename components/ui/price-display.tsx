type PriceDisplayProps = {
  price: number
  originalPrice?: number
  className?: string
}

export function PriceDisplay({
  price,
  originalPrice,
  className = "",
}: PriceDisplayProps) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="text-2xl font-bold text-gray-900">${price}</span>
      {originalPrice && (
        <span className="text-sm text-gray-500 line-through">
          ${originalPrice}
        </span>
      )}
    </div>
  )
}
