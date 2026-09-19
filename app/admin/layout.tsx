import Link from "next/link"

import { requireAdmin } from "@/lib/authz"

const adminNavLinks = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
]

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-6 h-14">
            <span className="font-bold text-gray-900">Admin</span>
            {adminNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 py-8">{children}</div>
    </div>
  )
}
