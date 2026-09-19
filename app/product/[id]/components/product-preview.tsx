"use client"

import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Product } from "@/types/product"
import { useEffect, useRef, useState } from "react"

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxwYXRoIGZpbGw9IiNlNWU3ZWIiIGQ9Ik0wIDBoMXYxSDB6Ii8+PC9zdmc+"

function ProductPreview({ product }: { product: Product }) {
  const images = product.images || [product.image]
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

  function showNextImage() {
    setSelectedImage(current => (current + 1) % images.length)
  }

  function showPreviousImage() {
    setSelectedImage(current => (current - 1 + images.length) % images.length)
  }

  useEffect(() => {
    if (!isLightboxOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsLightboxOpen(false)
      if (event.key === "ArrowRight") showNextImage()
      if (event.key === "ArrowLeft") showPreviousImage()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <button
        type="button"
        className="block aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 text-left"
        aria-label={`Open larger image of ${product.name}`}
        onClick={() => setIsLightboxOpen(true)}
        onKeyDown={event => {
          if (event.key === "ArrowRight") showNextImage()
          if (event.key === "ArrowLeft") showPreviousImage()
        }}
        onTouchStart={event => {
          touchStartX.current = event.touches[0]?.clientX ?? null
        }}
        onTouchEnd={event => {
          if (touchStartX.current === null) return
          const distance = event.changedTouches[0].clientX - touchStartX.current
          if (Math.abs(distance) > 40) {
            if (distance < 0) {
              showNextImage()
            } else {
              showPreviousImage()
            }
          }
          touchStartX.current = null
        }}
      >
        <ImageWithFallback
          src={images[selectedImage]}
          alt={product.name}
          width={960}
          height={960}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
        />
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`Show image ${index + 1} of ${product.name}`}
              aria-current={selectedImage === index ? "true" : undefined}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <ImageWithFallback
                src={src}
                alt={`${product.name} ${index + 1}`}
                width={80}
                height={80}
                sizes="80px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} image viewer`}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900"
            onClick={() => setIsLightboxOpen(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="absolute left-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900"
            aria-label="Previous image"
            onClick={event => {
              event.stopPropagation()
              showPreviousImage()
            }}
          >
            Previous
          </button>
          <ImageWithFallback
            src={images[selectedImage]}
            alt={`${product.name}, enlarged view`}
            width={1200}
            height={1200}
            sizes="90vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="max-h-[90vh] w-auto max-w-[85vw] object-contain"
            onClick={event => event.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900"
            aria-label="Next image"
            onClick={event => {
              event.stopPropagation()
              showNextImage()
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export { ProductPreview }
