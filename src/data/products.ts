
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
  category:
    | "Dresses"
    | "Tops"
    | "Bottoms"
    | "Outerwear"
    | "Sets"
    | "Jackets";
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
    name: "Elegant Set",
    subtitle: "The everyday statement",
    description: "A timeless TALA set.",
    price: 1200,
    category: "Sets",
    image: "/images/product-1.jpg",
    images: ["/images/product-1.jpg"],
    colors: [{ name: "Beige", value: "#D8C8B8" }],
    sizes: ["S", "M", "L", "XL"],
    rating: 5,
    reviews: 0,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    isAvailable: true,
    tags: ["New"],
  },
  {
    id: "2",
    name: "Classic Jacket",
    subtitle: "A refined essential",
    description: "A classic jacket by TALA.",
    price: 1500,
    category: "Jackets",
    image: "/images/product-2.jpg",
    images: ["/images/product-2.jpg"],
    colors: [{ name: "Brown", value: "#80634D" }],
    sizes: ["S", "M", "L", "XL"],
    rating: 5,
    reviews: 0,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    isAvailable: true,
    tags: ["New"],
  },
];
