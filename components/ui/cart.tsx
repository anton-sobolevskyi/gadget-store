"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Button } from "./button";
import { Badge } from "./badge";

function Cart() {
  const cartCount = useStore((state) => state.getCartCount());

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/cart">
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {cartCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}

export { Cart };
