import { create } from "zustand"
import { persist } from "zustand/middleware"

interface StoreState {
  wishlist: string[]
  hasHydrated: boolean
  toggleWishlist: (productId: string) => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useStore = create<StoreState>()(
  persist(
    set => ({
      wishlist: [],
      hasHydrated: false,

      toggleWishlist: productId => {
        set(state => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter(id => id !== productId)
            : [...state.wishlist, productId],
        }))
      },
      setHasHydrated: hasHydrated => set({ hasHydrated }),
    }),
    {
      name: "gadget-store",
      skipHydration: true,
      onRehydrateStorage: () => state => state?.setHasHydrated(true),
    }
  )
)
