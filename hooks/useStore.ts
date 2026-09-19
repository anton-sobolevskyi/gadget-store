import { create } from "zustand"
import { persist } from "zustand/middleware"

interface StoreState {
  wishlist: string[]
  toggleWishlist: (productId: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    set => ({
      wishlist: [],

      toggleWishlist: productId => {
        set(state => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter(id => id !== productId)
            : [...state.wishlist, productId],
        }))
      },
    }),
    {
      name: "gadget-store",
      skipHydration: true,
    }
  )
)
