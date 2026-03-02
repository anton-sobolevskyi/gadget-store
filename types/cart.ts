import { Product } from "./product"

export interface CartItem extends Product {
  quantity: number
  selectedColor?: string
  selectedStorage?: string
}
