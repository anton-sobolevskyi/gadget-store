export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  description: string
  specifications: Record<string, string>
  colors?: string[]
  storage?: string[]
  images?: string[]
}
