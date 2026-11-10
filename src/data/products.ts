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

export const PRODUCTS: Product[] = [];
