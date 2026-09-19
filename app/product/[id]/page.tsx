import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductBreadcrumb } from "./components/product-breadcrumb"
import { Product } from "@/types/product"
import { Shield, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProductSettings } from "./components/product-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/app/components/product-card"
import { ProductPreview } from "./components/product-preview"
import { getProductById, getRelatedProducts } from "@/lib/repositories/products"
import { PriceDisplay } from "@/components/ui/price-display"
import { RatingStars } from "@/components/ui/rating-stars"

type ProductDetailProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return { title: "Product not found" }
  }

  return {
    title: `${product.name} | Gadget Hub`,
    description: product.description,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { id } = await params
  const product: Product | null = await getProductById(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images ?? [product.image],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
                <RatingStars
                  rating={product.rating}
                  reviews={product.reviews}
                  size="md"
                />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
                className="[&_span:first-child]:text-4xl"
              />
              {product.originalPrice && (
                <>
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
