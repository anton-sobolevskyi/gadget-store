"use client"

import { useStore } from "@/hooks/useStore"
import { useEffect } from "react"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
