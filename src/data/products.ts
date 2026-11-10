
export type ProductColor = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: "Dresses" | "Tops" | "Bottoms" | "Outerwear" | "Sets";
  image: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  rating: number;
  reviews: number;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  tags: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "The Essential Dress",
    subtitle: "Effortless everyday elegance",
    description: "A timeless wardrobe essential designed with a clean silhouette and a comfortable feel. Made for everyday styling and special moments.",
    price: 1890,
    oldPrice: 2290,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=85",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85"
    ],
    colors: [
      { name: "Ivory", value: "#E8DFD1" },
      { name: "Black", value: "#171717" },
      { name: "Taupe", value: "#A58E78" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 28,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isAvailable: true,
    tags: ["Essential", "Elegant", "Everyday"]
  },
  {
    id: "2",
    name: "Soft Structure Top",
    subtitle: "Minimal form, maximum comfort",
    description: "A refined top with a versatile shape. Designed to pair effortlessly with your favorite trousers, skirts, and everyday essentials.",
    price: 990,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900&q=85",
      "https://images.unsplash.com/photo-1564257577-7a3c3e8e1f4a?w=900&q=85"
    ],
    colors: [
      { name: "Cream", value: "#E9E0D2" },
      { name: "Chocolate", value: "#5B3B2E" }
    ],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.8,
    reviews: 19,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    isAvailable: true,
    tags: ["Minimal", "Soft"]
  },
  {
    id: "3",
    name: "Modern Tailored Pants",
    subtitle: "A polished everyday silhouette",
    description: "Tailored trousers with a modern shape and a versatile finish. A refined piece for building effortless outfits.",
    price: 1450,
    oldPrice: 1690,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1506629905607-d9a8a7e4c4e5?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1506629905607-d9a8a7e4c4e5?w=900&q=85"
    ],
    colors: [
      { name: "Stone", value: "#B8AA96" },
      { name: "Black", value: "#171717" }
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 16,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    isAvailable: true,
    tags: ["Tailored", "Essential"]
  },
  {
    id: "4",
    name: "The Weekend Set",
    subtitle: "Relaxed matching essentials",
    description: "A coordinated set created for relaxed days and effortless styling. Wear it together or style each piece separately.",
    price: 2190,
    category: "Sets",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85"
    ],
    colors: [
      { name: "Sand", value: "#C9B69C" },
      { name: "Black", value: "#171717" }
    ],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviews: 34,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isAvailable: true,
    tags: ["Matching", "Comfort"]
  },
  {
    id: "5",
    name: "Classic Layer Jacket",
    subtitle: "The finishing touch",
    description: "A versatile outer layer with a timeless look. Designed to bring structure and character to simple outfits.",
    price: 2490,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1548624149-f7d8d6e1c9c5?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1548624149-f7d8d6e1c9c5?w=900&q=85"
    ],
    colors: [
      { name: "Taupe", value: "#A58E78" },
      { name: "Charcoal", value: "#383838" }
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 12,
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    isAvailable: true,
    tags: ["Layering", "Classic"]
  },
  {
    id: "6",
    name: "Sculpted Midi Dress",
    subtitle: "Modern elegance",
    description: "A sophisticated midi dress with a beautifully balanced silhouette. An elegant choice for day-to-evening styling.",
    price: 1990,
    oldPrice: 2390,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85"
    ],
    colors: [
      { name: "Ivory", value: "#E8DFD1" },
      { name: "Mocha", value: "#80634F" }
    ],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.9,
    reviews: 41,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isAvailable: true,
    tags: ["Midi", "Elegant"]
  },
  {
    id: "7",
    name: "Everyday Essential Tee",
    subtitle: "Simple by design",
    description: "A clean everyday tee made to become part of your regular rotation. Easy to style, easy to wear.",
    price: 690,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85"
    ],
    colors: [
      { name: "White", value: "#F4F1EA" },
      { name: "Black", value: "#171717" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.6,
    reviews: 22,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    isAvailable: true,
    tags: ["Basic", "Everyday"]
  },
  {
    id: "8",
    name: "Relaxed Wide Leg Pants",
    subtitle: "Movement meets simplicity",
    description: "Relaxed wide-leg trousers designed for comfortable movement and a clean modern appearance.",
    price: 1390,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=900&q=85"
    ],
    colors: [
      { name: "Beige", value: "#D3C2A8" },
      { name: "Black", value: "#171717" }
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 18,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    isAvailable: true,
    tags: ["Relaxed", "Modern"]
  }
];
