import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllProducts } from "@/lib/repositories/products"

import { deleteProductAction } from "./actions"
import { DeleteProductButton } from "./components/delete-product-button"

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">New product</Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 object-cover rounded-md border"
                  />
                </td>
                <td className="p-3 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="p-3 text-gray-600">{product.category}</td>
                <td className="p-3 text-gray-600">
                  ${product.price.toFixed(2)}
                </td>
                <td className="p-3">
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? "In stock" : "Out of stock"}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <DeleteProductButton
                      productId={product.id}
                      action={deleteProductAction}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
