import { products } from "@/data/products"
import { Slide } from "@/types/ui"

export const aboutLinks = [
  { href: "/about", name: "About Us" },
  { href: "/careers", name: "Careers" },
  { href: "/press", name: "Press" },
  { href: "/blog", name: "Blog" },
]

export const supportLinks = [
  { href: "/contact", name: "Contact Us" },
  { href: "/faq", name: "FAQ" },
  { href: "/shipping", name: "Shipping Info" },
  { href: "/returns", name: "Returns" },
]

export const policyLinks = [
  { href: "/privacy", name: "Privacy Policy" },
  { href: "/terms", name: "Terms of Service" },
  { href: "/cookies", name: "Cookie Policy" },
  { href: "/warranty", name: "Warranty" },
]

export const featuredProducts = products.slice(0, 4)
export const bestSellers = products.filter(p => p.rating >= 4.7)

export const heroSlides: Slide[] = [
  {
    title: "Experience the Future",
    subtitle: "Get up to 20% off on flagship smartphones",
    cta: "Shop Now",
    image:
      "https://images.unsplash.com/photo-1761906976176-0559a6d130dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9kZXJuJTIwYmxhY2slMjBnYWRnZXR8ZW58MXx8fHwxNzcyMTIwNTMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
]

export const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=="
