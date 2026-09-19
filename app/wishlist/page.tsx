import { getAllProducts } from "@/lib/repositories/products"
import { WishlistContent } from "./components/wishlist-content"

export const metadata = {
  title: "Wishlist | Gadget Hub",
  robots: { index: false },
}

export default async function WishlistPage() {
  const products = await getAllProducts()

  return <WishlistContent products={products} />
}
