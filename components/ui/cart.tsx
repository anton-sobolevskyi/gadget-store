"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useStore } from "@/hooks/useStore"
import { Button } from "./button"
import { Badge } from "./badge"

function Cart() {
  const cartCount = useStore(state => state.getCartCount())

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link
        href="/cart"
        aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
      >
        <ShoppingCart className="w-5 h-5" aria-hidden="true" />
        {cartCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            aria-hidden="true"
          >
            {cartCount}
          </Badge>
        )}
      </Link>
    </Button>
  )
}

export { Cart }
