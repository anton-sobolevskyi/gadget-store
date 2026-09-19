"use client"

import { useRef, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product } from "@/types/product"

import { getProductUploadUrlAction } from "../actions"

type ProductFormProps = {
  product?: Product
  action: (formData: FormData) => Promise<void>
}

function specificationsToText(specifications: Record<string, string>) {
  return Object.entries(specifications)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")
}

export function ProductForm({ product, action }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(product?.image ?? "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    try {
      const { uploadUrl, publicUrl } = await getProductUploadUrlAction(
        file.name,
        file.type
      )
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })
      if (!response.ok) throw new Error("Upload failed")
      setImageUrl(publicUrl)
    } catch {
      setUploadError("Image upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => action(formData))
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <input type="hidden" name="image" value={imageUrl} />

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Price
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price}
            required
          />
        </div>
        <div>
          <label
            htmlFor="originalPrice"
            className="block text-sm font-medium mb-1"
          >
            Original price (optional)
          </label>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.originalPrice}
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Input
          id="category"
          name="category"
          defaultValue={product?.category}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block text-sm"
        />
        {isUploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading…</p>
        )}
        {uploadError && (
          <p className="text-sm text-red-600 mt-1">{uploadError}</p>
        )}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Product preview"
            className="mt-2 h-24 w-24 object-cover rounded-md border"
          />
        )}
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium mb-1">
          Additional image URLs (comma separated)
        </label>
        <Input
          id="images"
          name="images"
          defaultValue={product?.images?.join(", ")}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={product?.description}
          required
          rows={4}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      </div>

      <div>
        <label
          htmlFor="specifications"
          className="block text-sm font-medium mb-1"
        >
          Specifications (one per line, `Key: Value`)
        </label>
        <textarea
          id="specifications"
          name="specifications"
          defaultValue={
            product ? specificationsToText(product.specifications) : ""
          }
          rows={4}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="colors" className="block text-sm font-medium mb-1">
            Colors (comma separated)
          </label>
          <Input
            id="colors"
            name="colors"
            defaultValue={product?.colors?.join(", ")}
          />
        </div>
        <div>
          <label htmlFor="storage" className="block text-sm font-medium mb-1">
            Storage (comma separated)
          </label>
          <Input
            id="storage"
            name="storage"
            defaultValue={product?.storage?.join(", ")}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="inStock"
          name="inStock"
          defaultChecked={product?.inStock ?? true}
          className="size-4"
        />
        <label htmlFor="inStock" className="text-sm font-medium">
          In stock
        </label>
      </div>

      <Button type="submit" disabled={isPending || isUploading || !imageUrl}>
        {isPending ? "Saving…" : "Save product"}
      </Button>
    </form>
  )
}
