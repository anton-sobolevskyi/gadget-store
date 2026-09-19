import { Search, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Cart } from "../ui/cart"
import { auth } from "@/lib/auth"
import { getCartSessionId } from "@/lib/cart-session"
import { getCart } from "@/lib/repositories/cart"

async function Header() {
  const [session, sessionId] = await Promise.all([auth(), getCartSessionId()])
  const cart = await getCart(sessionId ?? "", session?.user?.id)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              GadgetHub
            </span>
          </Link>

          {/* Search Bar - Desktop/Tablet */}
          <form
            role="search"
            action="/search"
            method="GET"
            className="hidden md:flex flex-1 max-w-2xl"
          >
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <label htmlFor="site-search-desktop" className="sr-only">
                Search products
              </label>
              <Input
                id="site-search-desktop"
                name="q"
                type="search"
                placeholder="Search smartphones, headphones..."
                className="pl-10 h-10 rounded-lg border-gray-300 focus:border-blue-500"
              />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Icon - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Search"
              asChild
            >
              <Link href="/search">
                <Search className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist" aria-label="Wishlist">
                <Heart className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>

            {/* Cart */}
            <Cart count={cartCount} />

            {/* User */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account" aria-label="Account">
                <User className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <form
          role="search"
          action="/search"
          method="GET"
          className="md:hidden pb-3"
        >
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
            <label htmlFor="site-search-mobile" className="sr-only">
              Search products
            </label>
            <Input
              id="site-search-mobile"
              name="q"
              type="search"
              placeholder="Search products..."
              className="pl-10 h-10 rounded-lg border-gray-300"
            />
          </div>
        </form>
      </div>
    </header>
  )
}

export { Header }
