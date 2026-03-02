import { Product } from "@/types/product"

export const products: Product[] = [
  {
    id: "1",
    name: "Galaxy Pro X Max",
    price: 1299,
    originalPrice: 1499,
    image:
      "https://images.unsplash.com/photo-1761906976176-0559a6d130dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9kZXJuJTIwYmxhY2slMjBnYWRnZXR8ZW58MXx8fHwxNzcyMTIwNTMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Smartphones",
    rating: 4.8,
    reviews: 1243,
    inStock: true,
    description:
      'Experience the future with our flagship smartphone. Featuring a stunning 6.7" AMOLED display, advanced triple camera system, and all-day battery life. Perfect for photography enthusiasts and power users.',
    specifications: {
      Display: '6.7" AMOLED, 120Hz',
      Processor: "Snapdragon 8 Gen 3",
      RAM: "12GB",
      Storage: "256GB / 512GB",
      Camera: "50MP + 12MP + 10MP",
      Battery: "5000mAh",
      OS: "Android 14",
    },
    colors: ["Midnight Black", "Cosmic Blue", "Pearl White"],
    storage: ["256GB", "512GB"],
    images: [
      "https://images.unsplash.com/photo-1761906976176-0559a6d130dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9kZXJuJTIwYmxhY2slMjBnYWRnZXR8ZW58MXx8fHwxNzcyMTIwNTMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1761906976176-0559a6d130dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9kZXJuJTIwYmxhY2slMjBnYWRnZXR8ZW58MXx8fHwxNzcyMTIwNTMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "2",
    name: "AirWave Pro Headphones",
    price: 349,
    originalPrice: 399,
    image:
      "https://images.unsplash.com/photo-1612858250380-3206795f8a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyMDk0OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    rating: 4.9,
    reviews: 856,
    inStock: true,
    description:
      "Premium wireless headphones with industry-leading noise cancellation. Crystal-clear audio quality, 30-hour battery life, and supreme comfort for all-day wear.",
    specifications: {
      Type: "Over-ear, Wireless",
      "Noise Cancellation": "Active ANC",
      "Battery Life": "30 hours",
      Connectivity: "Bluetooth 5.3",
      Weight: "250g",
      "Charging Port": "USB-C",
    },
    colors: ["Silver", "Graphite", "Rose Gold"],
    images: [
      "https://images.unsplash.com/photo-1612858250380-3206795f8a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyMDk0OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "3",
    name: "FitTrack Watch Ultra",
    price: 449,
    image:
      "https://images.unsplash.com/photo-1665860455418-017fa50d29bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwZml0bmVzcyUyMHRyYWNrZXJ8ZW58MXx8fHwxNzcyMTAzMDY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Wearables",
    rating: 4.7,
    reviews: 654,
    inStock: true,
    description:
      "Advanced fitness tracking smartwatch with GPS, heart rate monitoring, sleep tracking, and more. Water-resistant up to 50m.",
    specifications: {
      Display: '1.9" AMOLED',
      "Battery Life": "18 days",
      "Water Resistance": "5ATM (50m)",
      Sensors: "GPS, Heart Rate, SpO2, Accelerometer",
      Connectivity: "Bluetooth, Wi-Fi",
      Compatibility: "iOS & Android",
    },
    colors: ["Midnight", "Starlight", "Ocean Blue"],
    images: [
      "https://images.unsplash.com/photo-1665860455418-017fa50d29bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwZml0bmVzcyUyMHRyYWNrZXJ8ZW58MXx8fHwxNzcyMTAzMDY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "4",
    name: "UltraBook Pro 15",
    price: 1899,
    originalPrice: 2199,
    image:
      "https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzIwMjU5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Laptops",
    rating: 4.8,
    reviews: 432,
    inStock: true,
    description:
      "Powerful laptop for professionals. Features the latest processor, dedicated graphics, and stunning Retina display.",
    specifications: {
      Display: '15.6" 4K Retina',
      Processor: "Intel Core i9",
      RAM: "32GB",
      Storage: "1TB SSD",
      Graphics: "NVIDIA RTX 4060",
      Battery: "Up to 12 hours",
      Weight: "1.8kg",
    },
    colors: ["Space Gray", "Silver"],
    storage: ["512GB", "1TB", "2TB"],
    images: [
      "https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzIwMjU5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "5",
    name: "Tab Pro 12",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1769603795371-ad63bd85d524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjBkaWdpdGFsfGVufDF8fHx8MTc3MjA5Mjc0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Tablets",
    rating: 4.6,
    reviews: 389,
    inStock: true,
    description:
      "Versatile tablet for work and entertainment. Large display, powerful performance, and stylus support.",
    specifications: {
      Display: '12.9" Liquid Retina',
      Processor: "M2 Chip",
      RAM: "8GB",
      Storage: "128GB / 256GB",
      Camera: "12MP Wide",
      Battery: "Up to 10 hours",
      Stylus: "Compatible",
    },
    colors: ["Silver", "Space Gray"],
    storage: ["128GB", "256GB", "512GB"],
    images: [
      "https://images.unsplash.com/photo-1769603795371-ad63bd85d524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjBkaWdpdGFsfGVufDF8fHx8MTc3MjA5Mjc0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "6",
    name: "ProCam X1",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzIwODg3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Cameras",
    rating: 4.9,
    reviews: 278,
    inStock: true,
    description:
      "Professional mirrorless camera with 45MP full-frame sensor. Perfect for professional photography and videography.",
    specifications: {
      Sensor: "45MP Full-Frame CMOS",
      "Video Recording": "8K 30fps, 4K 120fps",
      ISO: "100-51200",
      "Shutter Speed": "1/8000s",
      "Burst Mode": "20fps",
      Connectivity: "Wi-Fi, Bluetooth, USB-C",
      Weight: "680g (body only)",
    },
    images: [
      "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzIwODg3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
]

export const categories = [
  { id: "smartphones", name: "Smartphones", icon: "📱" },
  { id: "audio", name: "Audio", icon: "🎧" },
  { id: "wearables", name: "Wearables", icon: "⌚" },
  { id: "laptops", name: "Laptops", icon: "💻" },
  { id: "tablets", name: "Tablets", icon: "📱" },
  { id: "cameras", name: "Cameras", icon: "📷" },
]
