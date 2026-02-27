import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

import "@/styles/tailwind.css";

export const metadata: Metadata = {
  title: "Gudget Hub",
  description: "A gadget store built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
