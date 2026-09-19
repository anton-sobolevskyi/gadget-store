import type { Metadata } from "next"

import "@/styles/tailwind.css"
import { Toast } from "@/components/ui/toast"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { StoreProvider } from "@/providers/store-provider"

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Gadget Hub — Premium Tech & Gadgets",
    template: "%s | Gadget Hub",
  },
  description:
    "Shop the latest smartphones, headphones, wearables, laptops, tablets and cameras at Gadget Hub.",
  openGraph: {
    siteName: "Gadget Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-blue-600 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Skip to content
        </a>
        <Header />
        <StoreProvider>
          <main id="main-content">{children}</main>
        </StoreProvider>
        <Footer />
        <Toast position="top-right" />
      </body>
    </html>
  )
}
