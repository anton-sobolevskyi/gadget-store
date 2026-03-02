"use client"

import { ERROR_IMG_SRC } from "@/lib/constants"
import Image from "next/image"
import React, { useState } from "react"

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string
    width?: number
    height?: number
  }
) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt = "", style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Image
          width={360}
          height={360}
          src={ERROR_IMG_SRC}
          alt="Error loading image"
          {...rest}
          data-original-url={src}
        />
      </div>
    </div>
  ) : (
    <Image
      width={360}
      height={360}
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  )
}
