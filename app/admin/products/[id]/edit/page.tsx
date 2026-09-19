import { notFound } from "next/navigation"

import { getProductById } from "@/lib/repositories/products"

import { updateProductAction } from "../../actions"
import { ProductForm } from "../../components/product-form"

type EditProductPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

  const updateWithId = updateProductAction.bind(null, product.id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit product</h1>
      <ProductForm product={product} action={updateWithId} />
    </div>
  )
}
