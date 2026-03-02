import { Button } from "@/components/ui/button"
import { products } from "@/data/products"
import Link from "next/link"
import { ProductBreadcrumb } from "./components/product-breadcrumb"
import { Product } from "@/types/product"
import { Shield, Star, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProductSettings } from "./components/product-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/app/components/product-card"
import { ProductPreview } from "./components/product-preview"

type ProductDetailProps = {
  params: Promise<{ id: string }>
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { id } = await params
  const product: Product | undefined = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button asChild className="mt-4">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      <ProductBreadcrumb product={product} />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductPreview product={product} />

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge className="bg-red-500">
                    Save{" "}
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </Badge>
                </>
              )}
            </div>

            <ProductSettings product={product} />

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-sm">Free Shipping</div>
                  <div className="text-xs text-gray-600">
                    On orders over $50
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold text-sm">Secure Payment</div>
                  <div className="text-xs text-gray-600">100% secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviews})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              {product.description}
            </p>
          </TabsContent>

          <TabsContent value="specifications">
            <div className="bg-gray-50 rounded-lg p-6">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <tr
                        key={key}
                        className="border-b border-gray-200 last:border-0"
                      >
                        <td className="py-3 font-semibold text-gray-900 w-1/3">
                          {key}
                        </td>
                        <td className="py-3 text-gray-700">{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="text-center py-12 text-gray-600">
              <p>Reviews feature coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
