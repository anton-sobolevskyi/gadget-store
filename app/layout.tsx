import type { Metadata } from "next"

import "@/styles/tailwind.css"
import { Toast } from "@/components/ui/toast"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { StoreProvider } from "@/providers/store-provider"

export const metadata: Metadata = {
  title: "Gudget Hub",
  description: "A gadget store built with Next.js and Supabase",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Header />
        <StoreProvider>{children}</StoreProvider>
        <Footer />
        <Toast position="top-right" />
      </body>
    </html>
  )
}
