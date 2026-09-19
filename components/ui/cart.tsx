import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"

function Cart({ count }: { count: number }) {
  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link
        href="/cart"
        aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      >
        <ShoppingCart className="w-5 h-5" aria-hidden="true" />
        {count > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            aria-hidden="true"
          >
            {count}
          </Badge>
        )}
      </Link>
    </Button>
  )
}

export { Cart }
