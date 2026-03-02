"use client"

import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Product } from "@/types/product"
import { useState } from "react"

function ProductPreview({ product }: { product: Product }) {
  const images = product.images || [product.image]
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
        <ImageWithFallback
          src={images[selectedImage]}
          alt={product.name}
          width={960}
          height={960}
          className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((src, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <ImageWithFallback
                src={src}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { ProductPreview }
