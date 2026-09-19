import { Star } from "lucide-react"

type RatingStarsProps = {
  rating: number
  reviews?: number
  size?: "sm" | "md"
}

export function RatingStars({
  rating,
  reviews,
  size = "sm",
}: RatingStarsProps) {
  const iconClass = size === "md" ? "h-5 w-5" : "h-4 w-4"

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rated ${rating} out of 5${reviews === undefined ? "" : `, ${reviews} reviews`}`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`${iconClass} ${
            index < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      {reviews !== undefined && (
        <span className="ml-1 text-sm text-gray-600">({reviews})</span>
      )}
    </div>
  )
}
