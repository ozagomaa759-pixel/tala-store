 "use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight,
  Heart, Minus, Plus, Ruler, ShieldCheck, ShoppingBag, Truck, X, ZoomIn,
  Sparkles, PackageCheck, Star, RotateCcw, Info, Share2, Copy, AlertCircle,
  MessageCircle, Clock3, BadgeCheck, Eye, RefreshCw, Instagram
} from "lucide-react";
import { addToCart } from "@/lib/cart";

/* -------------------------------------------------------------------------- */
/* TALA PRODUCT DETAIL EXPERIENCE                                             */
/* This is a front-end demonstration. Product prices, stock and reviews are  */
/* sample content until connected to a verified store database.               */
/* -------------------------------------------------------------------------- */

type ProductColor = { name: string; value: string };
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  material: string;
  fit: string;
  colorFamily: string;
  badge: string | null;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  details: string[];
  care: string;
  sku: string;
  available: boolean;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "The Signature Dress",
    category: "Dresses",
    price: 1850,
    description: "A refined signature silhouette for memorable occasions.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0001",
    available: true,
  },
  {
    id: 2,
    name: "Classic Elegance",
    category: "Dresses",
    price: 1250,
    description: "An understated dress designed for versatile styling.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0002",
    available: true,
  },
  {
    id: 3,
    name: "Modern Essential",
    category: "Tops",
    price: 1450,
    description: "A modern essential with a clean and confident shape.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "taupe",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0003",
    available: true,
  },
  {
    id: 4,
    name: "The Timeless Set",
    category: "Sets",
    price: 1650,
    description: "A coordinated look that makes getting dressed effortless.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "sand",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0004",
    available: true,
  },
  {
    id: 5,
    name: "Soft Structure",
    category: "Outerwear",
    price: 2250,
    description: "A considered outer layer with a timeless attitude.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Outerwear collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0005",
    available: true,
  },
  {
    id: 6,
    name: "Everyday Grace",
    category: "Tops",
    price: 950,
    description: "An easy wardrobe piece for everyday combinations.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0006",
    available: true,
  },
  {
    id: 7,
    name: "Evening Muse",
    category: "Dresses",
    price: 2450,
    description: "An elegant evening look with a distinctive presence.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "black",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0007",
    available: true,
  },
  {
    id: 8,
    name: "Minimal Form",
    category: "Sets",
    price: 1750,
    description: "A minimal coordinated outfit with versatile appeal.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "taupe",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0008",
    available: true,
  },
  {
    id: 9,
    name: "Sculpted Form 09",
    category: "Dresses",
    price: 990,
    description: "A thoughtfully selected TALA dresses piece with a sculpted character and versatile styling potential.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: "NEW ARRIVAL",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0009",
    available: true,
  },
  {
    id: 10,
    name: "Essential Form 10",
    category: "Tops",
    price: 1190,
    description: "A thoughtfully selected TALA tops piece with a essential character and versatile styling potential.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0010",
    available: true,
  },
  {
    id: 11,
    name: "Refined Look 11",
    category: "Sets",
    price: 1390,
    description: "A thoughtfully selected TALA sets piece with a refined character and versatile styling potential.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "taupe",
    badge: BESTSELLER,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0011",
    available: true,
  },
  {
    id: 12,
    name: "Modern Look 12",
    category: "Outerwear",
    price: 1590,
    description: "A thoughtfully selected TALA outerwear piece with a modern character and versatile styling potential.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "sand",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Outerwear collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0012",
    available: true,
  },
  {
    id: 13,
    name: "Classic Piece 13",
    category: "Dresses",
    price: 1790,
    description: "A thoughtfully selected TALA dresses piece with a classic character and versatile styling potential.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0013",
    available: true,
  },
  {
    id: 14,
    name: "Soft Piece 14",
    category: "Tops",
    price: 1990,
    description: "A thoughtfully selected TALA tops piece with a soft character and versatile styling potential.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0014",
    available: true,
  },
  {
    id: 15,
    name: "Everyday Set 15",
    category: "Sets",
    price: 2190,
    description: "A thoughtfully selected TALA sets piece with a everyday character and versatile styling potential.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "taupe",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0015",
    available: true,
  },
  {
    id: 16,
    name: "Evening Set 16",
    category: "Outerwear",
    price: 2390,
    description: "A thoughtfully selected TALA outerwear piece with a evening character and versatile styling potential.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "sand",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Outerwear collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0016",
    available: true,
  },
  {
    id: 17,
    name: "Sculpted Silhouette 17",
    category: "Dresses",
    price: 990,
    description: "A thoughtfully selected TALA dresses piece with a sculpted character and versatile styling potential.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0017",
    available: true,
  },
  {
    id: 18,
    name: "Essential Silhouette 18",
    category: "Tops",
    price: 1190,
    description: "A thoughtfully selected TALA tops piece with a essential character and versatile styling potential.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: "NEW ARRIVAL",
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0018",
    available: true,
  },
  {
    id: 19,
    name: "Refined Layer 19",
    category: "Sets",
    price: 1390,
    description: "A thoughtfully selected TALA sets piece with a refined character and versatile styling potential.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "taupe",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0019",
    available: true,
  },
  {
    id: 20,
    name: "Modern Layer 20",
    category: "Outerwear",
    price: 1590,
    description: "A thoughtfully selected TALA outerwear piece with a modern character and versatile styling potential.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "sand",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Outerwear collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0020",
    available: true,
  },
  {
    id: 21,
    name: "Classic Statement 21",
    category: "Dresses",
    price: 1790,
    description: "A thoughtfully selected TALA dresses piece with a classic character and versatile styling potential.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0021",
    available: true,
  },
  {
    id: 22,
    name: "Soft Statement 22",
    category: "Tops",
    price: 1990,
    description: "A thoughtfully selected TALA tops piece with a soft character and versatile styling potential.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: BESTSELLER,
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0022",
    available: true,
  },
  {
    id: 23,
    name: "Everyday Edit 23",
    category: "Sets",
    price: 2190,
    description: "A thoughtfully selected TALA sets piece with a everyday character and versatile styling potential.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "taupe",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0023",
    available: true,
  },
  {
    id: 24,
    name: "Evening Edit 24",
    category: "Outerwear",
    price: 2390,
    description: "A thoughtfully selected TALA outerwear piece with a evening character and versatile styling potential.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "sand",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Outerwear collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0024",
    available: true,
  },
  {
    id: 25,
    name: "Sculpted Form 25",
    category: "Dresses",
    price: 990,
    description: "A thoughtfully selected TALA dresses piece with a sculpted character and versatile styling potential.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0025",
    available: true,
  },
  {
    id: 26,
    name: "Essential Form 26",
    category: "Tops",
    price: 1190,
    description: "A thoughtfully selected TALA tops piece with a essential character and versatile styling potential.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0026",
    available: true,
  },
  {
    id: 27,
    name: "Refined Look 27",
    category: "Sets",
    price: 1390,
    description: "A thoughtfully selected TALA sets piece with a refined character and versatile styling potential.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "taupe",
    badge: "NEW ARRIVAL",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0027",
    available: true,
  },
  {
    id: 28,
    name: "Modern Look 28",
    category: "Outerwear",
    price: 1590,
    description: "A thoughtfully selected TALA outerwear piece with a modern character and versatile styling potential.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "sand",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Outerwear collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0028",
    available: true,
  },
  {
    id: 29,
    name: "Classic Piece 29",
    category: "Dresses",
    price: 1790,
    description: "A thoughtfully selected TALA dresses piece with a classic character and versatile styling potential.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0029",
    available: true,
  },
  {
    id: 30,
    name: "Soft Piece 30",
    category: "Tops",
    price: 1990,
    description: "A thoughtfully selected TALA tops piece with a soft character and versatile styling potential.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0030",
    available: true,
  },
  {
    id: 31,
    name: "Everyday Set 31",
    category: "Sets",
    price: 2190,
    description: "A thoughtfully selected TALA sets piece with a everyday character and versatile styling potential.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "taupe",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0031",
    available: true,
  },
  {
    id: 32,
    name: "Evening Set 32",
    category: "Outerwear",
    price: 2390,
    description: "A thoughtfully selected TALA outerwear piece with a evening character and versatile styling potential.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "sand",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Outerwear collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0032",
    available: true,
  },
  {
    id: 33,
    name: "Sculpted Silhouette 33",
    category: "Dresses",
    price: 990,
    description: "A thoughtfully selected TALA dresses piece with a sculpted character and versatile styling potential.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: BESTSELLER,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0033",
    available: true,
  },
  {
    id: 34,
    name: "Essential Silhouette 34",
    category: "Tops",
    price: 1190,
    description: "A thoughtfully selected TALA tops piece with a essential character and versatile styling potential.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0034",
    available: true,
  },
  {
    id: 35,
    name: "Refined Layer 35",
    category: "Sets",
    price: 1390,
    description: "A thoughtfully selected TALA sets piece with a refined character and versatile styling potential.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "taupe",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0035",
    available: true,
  },
  {
    id: 36,
    name: "Modern Layer 36",
    category: "Outerwear",
    price: 1590,
    description: "A thoughtfully selected TALA outerwear piece with a modern character and versatile styling potential.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "sand",
    badge: "NEW ARRIVAL",
    images: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Outerwear collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0036",
    available: true,
  },
  {
    id: 37,
    name: "Classic Statement 37",
    category: "Dresses",
    price: 1790,
    description: "A thoughtfully selected TALA dresses piece with a classic character and versatile styling potential.",
    material: "Soft woven fabric",
    fit: "Relaxed fit",
    colorFamily: "black",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1400",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Dresses collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0037",
    available: true,
  },
  {
    id: 38,
    name: "Soft Statement 38",
    category: "Tops",
    price: 1990,
    description: "A thoughtfully selected TALA tops piece with a soft character and versatile styling potential.",
    material: "Premium textured fabric",
    fit: "Tailored fit",
    colorFamily: "ivory",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Tops collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0038",
    available: true,
  },
  {
    id: 39,
    name: "Everyday Edit 39",
    category: "Sets",
    price: 2190,
    description: "A thoughtfully selected TALA sets piece with a everyday character and versatile styling potential.",
    material: "Lightweight fabric",
    fit: "Classic fit",
    colorFamily: "taupe",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Sets collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0039",
    available: true,
  },
  {
    id: 40,
    name: "Evening Edit 40",
    category: "Outerwear",
    price: 2390,
    description: "A thoughtfully selected TALA outerwear piece with a evening character and versatile styling potential.",
    material: "Cotton blend",
    fit: "Regular fit",
    colorFamily: "sand",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&sat=-15",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Ivory", value: "#E8E0D5" },
      { name: "Warm Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [ "Outerwear collection", "Versatile styling", "Thoughtful finishing", "Designed for a considered wardrobe" ],
    care: "Follow the care label attached to the garment. Product-specific instructions should be checked before washing.",
    sku: "TALA-0040",
    available: true,
  },
];

const SIZE_LABELS = ["XS", "S", "M", "L", "XL"];
const MAX_QUANTITY = 10;
const STORE_CURRENCY = "EGP";
const SUPPORT_EMAIL = "hello@tala.example";
const SUPPORT_HANDLE = "@tala.store";

const SIZE_MEASUREMENTS = [
  { size: "XS", bust: "80–84", waist: "60–64", hips: "86–90" },
  { size: "S", bust: "84–88", waist: "64–68", hips: "90–94" },
  { size: "M", bust: "88–94", waist: "68–74", hips: "94–100" },
  { size: "L", bust: "94–100", waist: "74–80", hips: "100–106" },
  { size: "XL", bust: "100–106", waist: "80–86", hips: "106–112" },
];

const DELIVERY_MESSAGES = [
  "Delivery estimates are confirmed during order processing.",
  "Please check your address and phone number before checkout.",
  "Keep your order confirmation for future reference.",
];

const REVIEW_EXAMPLES = [
  { name: "Verified customer", rating: 5, title: "Beautiful finishing", body: "The design feels considered and easy to style.", date: "Sample review" },
  { name: "TALA customer", rating: 5, title: "Lovely wardrobe piece", body: "A versatile piece that works with different looks.", date: "Sample review" },
  { name: "Store visitor", rating: 4, title: "Elegant look", body: "The overall style is simple, elegant and timeless.", date: "Sample review" },
];

/* ------------------------------- Utilities -------------------------------- */

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-EG", {
    maximumFractionDigits: 0,
  }).format(value) + ` ${STORE_CURRENCY}`;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = PRODUCTS.filter(
    (item) => item.id !== product.id && item.category === product.category
  );
  const otherCategory = PRODUCTS.filter(
    (item) => item.id !== product.id && item.category !== product.category
  );
  return [...sameCategory, ...otherCategory].slice(0, limit);
}

function getProductImage(product: Product, index: number): string {
  if (product.images.length === 0) return "";
  return product.images[index % product.images.length];
}

function isValidSize(size: string, product: Product): boolean {
  return product.sizes.includes(size);
}

function isValidColor(color: string, product: Product): boolean {
  return product.colors.some((item) => item.value === color);
}

function getSizeDescription(size: string): string {
  const descriptions: Record<string, string> = {
    XS: "Extra small",
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra large",
  };
  return descriptions[size] ?? "Choose a size";
}

function getCategoryLabel(category: string): string {
  return category.toUpperCase();
}

function getShareUrl(productId: number): string {
  if (typeof window === "undefined") return `/products/${productId}`;
  return `${window.location.origin}/products/${productId}`;
}

function safeCopy(text: string): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return Promise.reject(new Error("Clipboard unavailable"));
  }
  return navigator.clipboard.writeText(text);
}

function makeWishlistKey(productId: number): string {
  return `tala-wishlist-${productId}`;
}

function readWishlist(productId: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(makeWishlistKey(productId)) === "true";
  } catch {
    return false;
  }
}

function writeWishlist(productId: number, active: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(makeWishlistKey(productId), String(active));
  } catch {
    // Wishlist remains usable for the current page session.
  }
}

function getDefaultQuantity(): number {
  return 1;
}

function getDefaultImageIndex(): number {
  return 0;
}

function getInitialSelectedSize(): string {
  return "";
}

function getInitialSelectedColor(product: Product): string {
  return product.colors[0]?.value ?? "";
}

function getInitialNotice(): string {
  return "";
}

function getInitialZoomState(): boolean {
  return false;
}

function getInitialSizeGuideState(): boolean {
  return false;
}

function getInitialReviewState(): boolean {
  return false;
}

function getInitialFavoriteState(): boolean {
  return false;
}

function getInitialShareState(): boolean {
  return false;
}

function getInitialAccordionState(): string {
  return "";
}

function getInitialCopiedState(): boolean {
  return false;
}

function getInitialTabState(): string {
  return "details";
}

function getInitialMobileMenuState(): boolean {
  return false;
}

function getInitialFeedbackState(): string {
  return "";
}

function getInitialDeliveryState(): boolean {
  return false;
}

function getInitialCareState(): boolean {
  return false;
}

function getInitialDescriptionState(): boolean {
  return false;
}

function getInitialGalleryState(): boolean {
  return false;
}

function getInitialLoadingState(): boolean {
  return false;
}

function getInitialErrorState(): string {
  return "";
}

function getInitialSelectedReviewRating(): number {
  return 0;
}

function getInitialSearchState(): string {
  return "";
}

function getInitialFilterState(): string {
  return "all";
}

function getInitialSortState(): string {
  return "featured";
}

function getInitialShowAllState(): boolean {
  return false;
}

function getInitialQuantityInput(): string {
  return "1";
}

function getInitialCouponState(): string {
  return "";
}

function getInitialAccordionIndex(): number {
  return -1;
}

function getInitialActiveThumbnail(): number {
  return 0;
}

function getInitialShareMessage(): string {
  return "Share this TALA piece with someone who would love it.";
}

function getInitialStockMessage(): string {
  return "Availability is subject to confirmation.";
}

function getInitialShippingMessage(): string {
  return DELIVERY_MESSAGES[0];
}

function getInitialProductMessage(): string {
  return "A considered piece from the TALA collection.";
}

function getInitialReviewMessage(): string {
  return "Customer reviews shown here are sample presentation content.";
}

function getInitialSizeMessage(): string {
  return "Select the size that feels most comfortable.";
}

function getInitialColorMessage(): string {
  return "Choose your preferred color.";
}

function getInitialBagMessage(): string {
  return "Your selection will be added to the shopping bag.";
}

function getInitialWishlistMessage(): string {
  return "Save this piece to your wishlist.";
}

function getInitialCareMessage(): string {
  return "Always follow the garment care label.";
}

function getInitialReturnMessage(): string {
  return "Return conditions must be confirmed by the store.";
}

function getInitialSupportMessage(): string {
  return "Contact TALA for product assistance.";
}

function getInitialSkuMessage(product: Product): string {
  return `Reference: ${product.sku}`;
}

function getInitialPriceMessage(product: Product): string {
  return `Current displayed price: ${formatPrice(product.price)}`;
}

function getInitialCategoryMessage(product: Product): string {
  return `Part of the ${product.category} collection.`;
}

function getInitialFitMessage(product: Product): string {
  return `Fit description: ${product.fit}.`;
}

function getInitialMaterialMessage(product: Product): string {
  return `Fabric description: ${product.material}.`;
}

function getInitialAvailableMessage(product: Product): string {
  return product.available ? "Listed as available in this demo." : "Currently unavailable.";
}

function getInitialProductTitle(product: Product): string {
  return `${product.name} | TALA`;
}

function getInitialBreadcrumb(product: Product): string[] {
  return ["Home", "Collection", product.category, product.name];
}

function getInitialDetails(product: Product): string[] {
  return [...product.details];
}

function getInitialColors(product: Product): ProductColor[] {
  return [...product.colors];
}

function getInitialSizes(product: Product): string[] {
  return [...product.sizes];
}

function getInitialImages(product: Product): string[] {
  return [...product.images];
}

function getInitialRelated(product: Product): Product[] {
  return getRelatedProducts(product, 4);
}

function getInitialReviewList(): typeof REVIEW_EXAMPLES {
  return [...REVIEW_EXAMPLES];
}

function getInitialMeasurements(): typeof SIZE_MEASUREMENTS {
  return [...SIZE_MEASUREMENTS];
}

function getInitialGalleryCounter(index: number, total: number): string {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

function getInitialRatingLabel(rating: number): string {
  return `${rating.toFixed(1)} out of 5`;
}

function getInitialProductPath(product: Product): string {
  return `/products/${product.id}`;
}

function getInitialProductAlt(product: Product, index: number): string {
  return `${product.name}, product image ${index + 1}`;
}

function getInitialButtonLabel(selected: boolean): string {
  return selected ? "SELECTED" : "SELECT";
}

function getInitialQuantityLabel(quantity: number): string {
  return `${quantity} ${quantity === 1 ? "item" : "items"}`;
}

function getInitialStockLabel(available: boolean): string {
  return available ? "Availability to be confirmed" : "Unavailable";
}

function getInitialBadgeLabel(badge: string | null): string {
  return badge ?? "";
}

function getInitialProductDescription(product: Product): string {
  return product.description;
}

function getInitialCareDescription(product: Product): string {
  return product.care;
}

function getInitialMaterialDescription(product: Product): string {
  return `${product.material} · ${product.fit}`;
}

function getInitialColorName(product: Product, value: string): string {
  return product.colors.find((color) => color.value === value)?.name ?? "Not selected";
}

function getInitialSizeName(size: string): string {
  return size || "Not selected";
}

function getInitialSubtotal(product: Product, quantity: number): number {
  return product.price * quantity;
}

function getInitialReviewCount(): number {
  return REVIEW_EXAMPLES.length;
}

function getInitialSupportLink(): string {
  return `https://www.instagram.com/${SUPPORT_HANDLE.replace("@", "")}/`;
}

function getInitialEmailLink(): string {
  return `mailto:${SUPPORT_EMAIL}`;
}

function getInitialDeliveryNotes(): string[] {
  return [...DELIVERY_MESSAGES];
}

function getInitialColorStyle(value: string): React.CSSProperties {
  return { backgroundColor: value };
}

function getInitialProductClass(active: boolean): string {
  return active
    ? "border-[#292521] bg-[#292521] text-white"
    : "border-[#D8CFC2] text-[#292521] hover:border-[#292521]";
}

function getInitialImageClass(active: boolean): string {
  return active
    ? "outline outline-1 outline-offset-2 outline-[#292521]"
    : "opacity-70 hover:opacity-100";
}

function getInitialAccordionIcon(open: boolean): number {
  return open ? 180 : 0;
}

function getInitialQuantity(value: number): number {
  return clamp(Math.floor(value), 1, MAX_QUANTITY);
}

function getInitialImageIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

function getInitialReviewStars(rating: number): number[] {
  return Array.from({ length: 5 }, (_, index) => index < rating ? 1 : 0);
}

function getInitialSizeRows(): string[][] {
  return SIZE_MEASUREMENTS.map((row) => [
    row.size,
    row.bust,
    row.waist,
    row.hips,
  ]);
}

function getInitialCategoryCount(category: string): number {
  return PRODUCTS.filter((product) => product.category === category).length;
}

function getInitialProductCount(): number {
  return PRODUCTS.length;
}

function getInitialRelatedCount(product: Product): number {
  return getRelatedProducts(product, 4).length;
}

function getInitialImageCount(product: Product): number {
  return product.images.length;
}

function getInitialColorCount(product: Product): number {
  return product.colors.length;
}

function getInitialSizeCount(product: Product): number {
  return product.sizes.length;
}

function getInitialProductIsAvailable(product: Product): boolean {
  return product.available;
}

function getInitialCategoryNames(): string[] {
  return Array.from(new Set(PRODUCTS.map((product) => product.category)));
}

function getInitialPriceRange(): { minimum: number; maximum: number } {
  const prices = PRODUCTS.map((product) => product.price);
  return {
    minimum: Math.min(...prices),
    maximum: Math.max(...prices),
  };
}

function getInitialProductSummary(product: Product): string {
  return `${product.name} is part of the ${product.category} collection.`;
}

function getInitialOrderSummary(product: Product, size: string, color: string, quantity: number): string {
  return `${product.name} · ${size || "Size not selected"} · ${color || "Color not selected"} · ${quantity}`;
}

function getInitialAccessibleLabel(product: Product): string {
  return `View details for ${product.name}`;
}

function getInitialReviewAverage(): number {
  const total = REVIEW_EXAMPLES.reduce((sum, review) => sum + review.rating, 0);
  return total / REVIEW_EXAMPLES.length;
}

function getInitialFormattedReviewAverage(): string {
  return getInitialReviewAverage().toFixed(1);
}

function getInitialProductMetadata(product: Product): string[] {
  return [product.category, product.material, product.fit, product.sku];
}

function getInitialProductHighlights(product: Product): string[] {
  return [
    ...product.details,
    `Category: ${product.category}`,
    `Fit: ${product.fit}`,
  ];
}

function getInitialNoticeType(message: string): "error" | "success" | "info" {
  if (message.toLowerCase().includes("please")) return "error";
  if (message.toLowerCase().includes("added")) return "success";
  return "info";
}

function getInitialSocialText(product: Product): string {
  return `Discover ${product.name} from TALA.`;
}

function getInitialPageTitle(product: Product): string {
  return `${product.name} | TALA Collection`;
}

function getInitialDescriptionText(product: Product): string {
  return product.description;
}

function getInitialVariantKey(product: Product, size: string, color: string): string {
  return `${product.sku}-${size}-${color}`;
}

function getInitialCartPayload(product: Product, size: string, color: string, quantity: number) {
  return {
    productId: String(product.id),
    name: product.name,
    price: product.price,
    image: product.images[0],
    size,
    color,
    quantity,
  };
}

function getInitialReviewHeading(): string {
  return "Customer impressions";
}

function getInitialFitHeading(): string {
  return "Fit and sizing";
}

function getInitialDeliveryHeading(): string {
  return "Delivery information";
}

function getInitialCareHeading(): string {
  return "Care instructions";
}

function getInitialProductDetailsHeading(): string {
  return "Product details";
}

function getInitialYouMayLikeHeading(): string {
  return "You may also love";
}

function getInitialCollectionHeading(): string {
  return "Explore the collection";
}

function getInitialBrandStatement(): string {
  return "Timeless pieces. Thoughtful details.";
}

function getInitialBrandSubstatement(): string {
  return "A considered wardrobe, curated by TALA.";
}

function getInitialFooterCopyright(): string {
  return `© ${new Date().getFullYear()} TALA. All rights reserved.`;
}

/* ------------------------------ UI Components ----------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] tracking-[3px] text-[#A18B70]">
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-serif text-3xl md:text-4xl">{title}</h2>
      {description ? (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77716A]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function Breadcrumbs({ product }: { product: Product }) {
  const items = getInitialBreadcrumb(product);
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3 text-[9px] tracking-[1px] text-[#77716A]">
      <Link href="/" className="hover:text-[#292521]">HOME</Link>
      <ChevronRight size={12} />
      <Link href="/products" className="hover:text-[#292521]">COLLECTION</Link>
      <ChevronRight size={12} />
      <span>{items[2].toUpperCase()}</span>
      <ChevronRight size={12} />
      <span className="text-[#292521]">{product.name.toUpperCase()}</span>
    </nav>
  );
}

function Gallery({
  product,
  onZoom,
}: {
  product: Product;
  onZoom: (index: number) => void;
}) {
  const images = getInitialImages(product);
  const [active, setActive] = useState(getInitialActiveThumbnail());

  const go = (direction: number) => {
    setActive((current) => getInitialImageIndex(current + direction, images.length));
  };

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#E6DED3]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0.2, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={getInitialProductAlt(product, active)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
        <button onClick={() => go(-1)} aria-label="Previous product image" className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F4F0E9]/90">
          <ChevronLeft size={19} />
        </button>
        <button onClick={() => go(1)} aria-label="Next product image" className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F4F0E9]/90">
          <ChevronRight size={19} />
        </button>
        <button onClick={() => onZoom(active)} aria-label="Zoom product image" className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F0E9]/90">
          <ZoomIn size={18} />
        </button>
        <span className="absolute bottom-5 left-5 z-10 bg-[#292521]/80 px-3 py-2 text-[9px] tracking-[2px] text-white">
          {getInitialGalleryCounter(active, images.length)}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={`${product.id}-${index}`}
            onClick={() => setActive(index)}
            aria-label={`Show image ${index + 1}`}
            className={`relative aspect-[3/4] overflow-hidden bg-[#E6DED3] ${getInitialImageClass(active === index)}`}
          >
            <Image src={image} alt={getInitialProductAlt(product, index)} fill sizes="150px" className="object-cover" unoptimized />
          </button>
        ))}
      </div>
    </div>
  );
}

function ZoomViewer({
  product,
  index,
  onClose,
}: {
  product: Product;
  index: number;
  onClose: () => void;
}) {
  const image = getProductImage(product, index);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-5"
    >
      <button onClick={onClose} aria-label="Close image viewer" className="absolute right-6 top-6 z-10 text-white">
        <X size={28} />
      </button>
      <div className="relative h-[85vh] w-full max-w-3xl">
        <Image src={image} alt={product.name} fill sizes="90vw" className="object-contain" unoptimized />
      </div>
    </motion.div>
  );
}

function SizeGuide({
  onClose,
  selectedSize,
  onSelect,
}: {
  onClose: () => void;
  selectedSize: string;
  onSelect: (size: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-[#F4F0E9] p-7 md:p-10"
      >
        <div className="flex items-center justify-between">
          <Eyebrow>THE TALA FIT GUIDE</Eyebrow>
          <button onClick={onClose} aria-label="Close size guide"><X size={21} /></button>
        </div>
        <h2 className="mt-5 font-serif text-3xl">Find Your Perfect Fit</h2>
        <p className="mt-3 text-sm leading-7 text-[#77716A]">
          Compare your measurements with this general guide. All measurements are in centimeters.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="border-b border-[#D8CFC2]">
                {["Size", "Bust", "Waist", "Hips"].map((heading) => (
                  <th key={heading} className="px-3 py-4 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getInitialSizeRows().map((row) => (
                <tr key={row[0]} className={`border-b border-[#E3DBD0] ${selectedSize === row[0] ? "bg-[#E8E0D5]" : ""}`}>
                  {row.map((cell) => <td key={cell} className="px-3 py-4">{cell}</td>)}
                  <td className="hidden">
                    <button onClick={() => onSelect(row[0])}>Select {row[0]}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-[10px] leading-5 text-[#77716A]">
          This is a general sample guide. TALA should verify actual garment measurements before publishing.
        </p>
        <button onClick={onClose} className="mt-7 w-full bg-[#292521] py-4 text-[10px] tracking-[3px] text-white">
          CONTINUE SHOPPING
        </button>
      </motion.div>
    </motion.div>
  );
}

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#DDD5CA]">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left">
        <span className="text-[10px] tracking-[2px]">{title}</span>
        <motion.span animate={{ rotate: getInitialAccordionIcon(open) }}>
          <ChevronDown size={17} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm leading-7 text-[#77716A]">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ColorSelector({
  colors,
  selected,
  onSelect,
}: {
  colors: ProductColor[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const selectedName = colors.find((color) => color.value === selected)?.name;
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[2px]">SELECT COLOR</span>
        <span className="text-xs text-[#77716A]">{selectedName ?? "Choose a color"}</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-4">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onSelect(color.value)}
            aria-label={`Choose ${color.name}`}
            aria-pressed={selected === color.value}
            title={color.name}
            className={`flex h-9 w-9 items-center justify-center rounded-full border ${selected === color.value ? "border-[#292521] outline outline-1 outline-offset-2 outline-[#292521]" : "border-[#CFC5B8]"}`}
          >
            <span className="h-7 w-7 rounded-full border border-black/10" style={getInitialColorStyle(color.value)} />
          </button>
        ))}
      </div>
    </div>
  );
}

function SizeSelector({
  sizes,
  selected,
  onSelect,
  onOpenGuide,
}: {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
  onOpenGuide: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[2px]">SELECT SIZE</span>
        <button onClick={onOpenGuide} className="flex items-center gap-2 text-[10px] tracking-[1px] text-[#8D765A]">
          <Ruler size={14} /> SIZE GUIDE
        </button>
      </div>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            aria-pressed={selected === size}
            className={`border py-4 text-xs transition ${getInitialProductClass(selected === size)}`}
          >
            {size}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-[#8B8176]">{getSizeDescription(selected)}</p>
    </div>
  );
}

function QuantitySelector({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] tracking-[2px]">QUANTITY</span>
      <div className="flex items-center border border-[#D8CFC2]">
        <button onClick={() => onChange(clamp(quantity - 1, 1, MAX_QUANTITY))} aria-label="Decrease quantity" className="px-4 py-3">
          <Minus size={13} />
        </button>
        <span className="min-w-8 text-center text-xs" aria-live="polite">{quantity}</span>
        <button onClick={() => onChange(clamp(quantity + 1, 1, MAX_QUANTITY))} aria-label="Increase quantity" className="px-4 py-3">
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

function ServiceBenefits() {
  const benefits = [
    { icon: Truck, title: "DELIVERY", subtitle: "Order delivery details" },
    { icon: RotateCcw, title: "RETURNS", subtitle: "Store policy applies" },
    { icon: ShieldCheck, title: "SECURE", subtitle: "Protected shopping" },
  ];
  return (
    <div className="mt-9 grid grid-cols-3 gap-3 border-y border-[#DED6CB] py-6">
      {benefits.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex flex-col items-center gap-3 text-center">
          <Icon size={19} strokeWidth={1.3} />
          <span className="text-[8px] leading-4 tracking-[1px]">{title}</span>
          <span className="text-[8px] text-[#8B8176]">{subtitle}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
}: {
  review: (typeof REVIEW_EXAMPLES)[number];
}) {
  return (
    <article className="border border-[#DED6CB] p-6">
      <div className="flex gap-1 text-[#A18B70]">
        {getInitialReviewStars(review.rating).map((filled, index) => (
          <Star key={index} size={12} fill={filled ? "currentColor" : "none"} />
        ))}
      </div>
      <h3 className="mt-4 font-serif text-lg">{review.title}</h3>
      <p className="mt-3 text-xs leading-6 text-[#77716A]">{review.body}</p>
      <div className="mt-5 flex items-center justify-between text-[9px] text-[#8B8176]">
        <span>{review.name}</span>
        <span>{review.date}</span>
      </div>
    </article>
  );
}

function RelatedProducts({ product }: { product: Product }) {
  const related = getInitialRelated(product);
  return (
    <section className="container mt-28 border-t border-[#DED6CB] pt-16">
      <SectionHeading eyebrow="CURATED FOR YOU" title={getInitialYouMayLikeHeading()} />
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
        {related.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07 }}
          >
            <Link href={getInitialProductPath(item)} aria-label={getInitialAccessibleLabel(item)}>
              <div className="relative aspect-[3/4] overflow-hidden bg-[#E7DED3]">
                <Image src={item.images[0]} alt={item.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 hover:scale-105" unoptimized />
                {item.badge ? <span className="absolute left-3 top-3 bg-[#F4F0E9] px-2 py-2 text-[8px] tracking-[1px]">{item.badge}</span> : null}
              </div>
              <div className="mt-4">
                <p className="text-[9px] tracking-[2px] text-[#A18B70]">{item.category.toUpperCase()}</p>
                <h3 className="mt-2 font-serif text-lg">{item.name}</h3>
                <p className="mt-2 text-xs">{formatPrice(item.price)}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function BrandFooter() {
  return (
    <footer className="mt-24 bg-[#292521] px-6 py-16 text-[#F4F0E9]">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="font-serif text-4xl tracking-[5px] text-white">TALA</Link>
            <p className="mt-5 max-w-xs text-xs leading-7 text-[#C5BCAF]">{getInitialBrandStatement()} {getInitialBrandSubstatement()}</p>
          </div>
          <div>
            <h3 className="text-[10px] tracking-[3px] text-[#C5AD8D]">EXPLORE</h3>
            <div className="mt-6 flex flex-col gap-4 text-xs text-[#D7D0C5]">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/products" className="hover:text-white">Collection</Link>
              <Link href="/cart" className="hover:text-white">Shopping Bag</Link>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] tracking-[3px] text-[#C5AD8D]">CONNECT</h3>
            <div className="mt-6 flex flex-col gap-4 text-xs text-[#D7D0C5]">
              <a href={getInitialEmailLink()} className="hover:text-white">Email TALA</a>
              <a href={getInitialSupportLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Instagram size={14} /> Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/15 pt-7 text-[9px] tracking-[1px] text-[#BEB5A8] md:flex-row">
          <p>{getInitialFooterCopyright()}</p>
          <p>DESIGNED WITH ELEGANCE.</p>
        </div>
      </div>
    </footer>
  );
}

function ProductHighlights({ product }: { product: Product }) {
  const entries = getInitialProductHighlights(product);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {entries.map((entry) => (
        <div key={entry} className="flex items-start gap-3 text-xs leading-6 text-[#77716A]">
          <Check size={14} className="mt-1 shrink-0 text-[#A18B70]" />
          <span>{entry}</span>
        </div>
      ))}
    </div>
  );
}

function ProductMetadata({ product }: { product: Product }) {
  const metadata = getInitialProductMetadata(product);
  return (
    <div className="grid grid-cols-2 gap-3 border-y border-[#DED6CB] py-5">
      {metadata.map((item, index) => (
        <div key={`${item}-${index}`}>
          <p className="text-[8px] tracking-[2px] text-[#A18B70]">{["CATEGORY", "MATERIAL", "FIT", "REFERENCE"][index]}</p>
          <p className="mt-2 text-xs">{item}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Main Page --------------------------------- */

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = Number(params.id);
  const product = useMemo(() => getProductById(productId), [productId]);

  const [selectedSize, setSelectedSize] = useState(getInitialSelectedSize);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(getInitialQuantity);
  const [favorite, setFavorite] = useState(getInitialFavoriteState);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(getInitialSizeGuideState);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState(getInitialNotice);
  const [shareOpen, setShareOpen] = useState(getInitialShareState);
  const [copied, setCopied] = useState(getInitialCopiedState);
  const [activeTab, setActiveTab] = useState(getInitialTabState);
  const [showReviews, setShowReviews] = useState(getInitialReviewState);

  useEffect(() => {
    if (!product) return;
    setSelectedColor(getInitialSelectedColor(product));
    setFavorite(readWishlist(product.id));
  }, [product]);

  const selectedColorName = product?.colors.find((color) => color.value === selectedColor)?.name ?? "";
  const subtotal = product ? getInitialSubtotal(product, quantity) : 0;

  const handleAddToBag = () => {
    if (!product) return;
    if (!isValidSize(selectedSize, product)) {
      setNotice("Please select a size before adding this item.");
      return;
    }
    if (!isValidColor(selectedColor, product)) {
      setNotice("Please select a color before adding this item.");
      return;
    }
    try {
      addToCart(getInitialCartPayload(product, selectedSize, selectedColorName, quantity));
      setNotice(`${quantity} × ${product.name} added to your shopping bag.`);
    } catch {
      setNotice("We could not update your bag. Please try again.");
    }
  };

  const toggleFavorite = () => {
    if (!product) return;
    const next = !favorite;
    setFavorite(next);
    writeWishlist(product.id, next);
    setNotice(next ? "Saved to your wishlist." : "Removed from your wishlist.");
  };

  const handleShare = async () => {
    if (!product) return;
    const url = getShareUrl(product.id);
    try {
      if (navigator.share) {
        await navigator.share({ title: getInitialProductTitle(product), text: getInitialSocialText(product), url });
      } else {
        await safeCopy(url);
        setCopied(true);
        setNotice("Product link copied.");
      }
    } catch {
      setNotice("Sharing was cancelled or is unavailable on this device.");
    }
  };

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#F4F0E9] px-6 text-center">
        <Eyebrow>TALA COLLECTION</Eyebrow>
        <h1 className="mt-6 font-serif text-4xl">Product Not Found</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-[#77716A]">This product may have been moved or is not available in this sample catalogue.</p>
        <Link href="/products" className="mt-8 bg-[#292521] px-9 py-4 text-[10px] tracking-[3px] text-white">EXPLORE COLLECTION</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F0E9] pb-24">
      <div className="container pt-7">
        <Breadcrumbs product={product} />
      </div>

      <section className="container mt-9 grid items-start gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }}>
          <Gallery product={product} onZoom={setZoomIndex} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.08 }} className="lg:sticky lg:top-10">
          <div className="flex items-center justify-between">
            <Eyebrow>{getCategoryLabel(product.category)}</Eyebrow>
            {product.badge ? <span className="border border-[#B9A58D] px-3 py-2 text-[8px] tracking-[2px] text-[#8D765A]">{product.badge}</span> : null}
          </div>

          <h1 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">{product.name}</h1>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-lg">{formatPrice(product.price)}</span>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[10px] text-[#8D765A]">
            <Sparkles size={14} />
            <span>{getInitialProductSummary(product)}</span>
          </div>

          <p className="mt-8 max-w-lg text-sm leading-8 text-[#77716A]">{getInitialProductDescription(product)}</p>

          <div className="my-9 border-t border-[#DED6CB]" />

          <ColorSelector colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />

          <div className="mt-9">
            <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} onOpenGuide={() => setSizeGuideOpen(true)} />
          </div>

          <div className="mt-9">
            <QuantitySelector quantity={quantity} onChange={setQuantity} />
          </div>

          <div className="mt-9 flex gap-3">
            <button onClick={handleAddToBag} className="flex flex-1 items-center justify-center gap-3 bg-[#292521] px-5 py-5 text-[10px] tracking-[2px] text-white transition hover:bg-[#8D765A]">
              <ShoppingBag size={17} /> ADD TO BAG
            </button>
            <button onClick={toggleFavorite} aria-label="Toggle wishlist" aria-pressed={favorite} className={`flex w-16 items-center justify-center border transition ${favorite ? "border-[#292521] bg-[#292521] text-white" : "border-[#D8CFC2] hover:border-[#292521]"}`}>
              <Heart size={19} fill={favorite ? "currentColor" : "none"} />
            </button>
            <button onClick={handleShare} aria-label="Share product" className="flex w-16 items-center justify-center border border-[#D8CFC2] hover:border-[#292521]">
              <Share2 size={18} />
            </button>
          </div>

          <AnimatePresence>
            {notice ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-4 flex items-center justify-between border border-[#D8CFC2] bg-[#ECE5DA] px-4 py-4 text-xs">
                <span>{notice}</span>
                <button onClick={() => setNotice("")} aria-label="Dismiss message"><X size={15} /></button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mt-5 flex items-center justify-between text-[10px] text-[#8B8176]">
            <span>{getInitialSkuMessage(product)}</span>
            <span>{getInitialStockLabel(product.available)}</span>
          </div>

          <ServiceBenefits />

          <div className="mt-8">
            <Accordion title="PRODUCT DETAILS">
              <ProductHighlights product={product} />
              <div className="mt-6"><ProductMetadata product={product} /></div>
            </Accordion>
            <Accordion title="DELIVERY INFORMATION">
              <ul className="space-y-2">
                {getInitialDeliveryNotes().map((message) => <li key={message}>{message}</li>)}
              </ul>
            </Accordion>
            <Accordion title="CARE INSTRUCTIONS">
              <p>{getInitialCareDescription(product)}</p>
            </Accordion>
            <Accordion title="SIZE AND FIT">
              <p>{getInitialFitMessage(product)}</p>
              <button onClick={() => setSizeGuideOpen(true)} className="mt-4 border-b border-[#A18B70] pb-1 text-[10px] tracking-[2px]">OPEN SIZE GUIDE</button>
            </Accordion>
          </div>
        </motion.div>
      </section>

      <section className="container mt-20 border-y border-[#DED6CB] py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <Sparkles className="mx-auto text-[#A18B70]" size={23} />
            <h3 className="mt-4 font-serif text-xl">Thoughtful Design</h3>
            <p className="mt-2 text-xs leading-6 text-[#77716A]">A considered approach to everyday elegance.</p>
          </div>
          <div className="text-center">
            <PackageCheck className="mx-auto text-[#A18B70]" size={23} />
            <h3 className="mt-4 font-serif text-xl">Curated Collection</h3>
            <p className="mt-2 text-xs leading-6 text-[#77716A]">Discover pieces selected for their timeless character.</p>
          </div>
          <div className="text-center">
            <BadgeCheck className="mx-auto text-[#A18B70]" size={23} />
            <h3 className="mt-4 font-serif text-xl">Personal Assistance</h3>
            <p className="mt-2 text-xs leading-6 text-[#77716A]">Contact TALA for product and order questions.</p>
          </div>
        </div>
      </section>

      <section className="container mt-20">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <Eyebrow>THE TALA STANDARD</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl">A closer look</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("details")} className={`border px-4 py-3 text-[9px] tracking-[2px] ${activeTab === "details" ? "border-[#292521] bg-[#292521] text-white" : "border-[#D8CFC2]"}`}>DETAILS</button>
            <button onClick={() => setActiveTab("fit")} className={`border px-4 py-3 text-[9px] tracking-[2px] ${activeTab === "fit" ? "border-[#292521] bg-[#292521] text-white" : "border-[#D8CFC2]"}`}>FIT</button>
            <button onClick={() => setActiveTab("care")} className={`border px-4 py-3 text-[9px] tracking-[2px] ${activeTab === "care" ? "border-[#292521] bg-[#292521] text-white" : "border-[#D8CFC2]"}`}>CARE</button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-8 max-w-3xl border-l border-[#B9A58D] pl-6">
            {activeTab === "details" ? <ProductHighlights product={product} /> : null}
            {activeTab === "fit" ? <p className="text-sm leading-8 text-[#77716A]">{getInitialFitMessage(product)} Use the size guide to compare measurements.</p> : null}
            {activeTab === "care" ? <p className="text-sm leading-8 text-[#77716A]">{product.care}</p> : null}
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="container mt-24">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow>COMMUNITY NOTES</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl">Customer impressions</h2>
            <p className="mt-3 text-xs text-[#77716A]">Sample presentation reviews — replace with verified customer feedback.</p>
          </div>
          <button onClick={() => setShowReviews(!showReviews)} className="border border-[#D8CFC2] px-5 py-3 text-[9px] tracking-[2px]">
            {showReviews ? "HIDE REVIEWS" : "VIEW REVIEWS"}
          </button>
        </div>
        <AnimatePresence>
          {showReviews ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-8 grid gap-4 overflow-hidden md:grid-cols-3">
              {getInitialReviewList().map((review, index) => <ReviewCard key={`${review.title}-${index}`} review={review} />)}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <RelatedProducts product={product} />

      <div className="container mt-20 text-center">
        <Link href="/products" className="inline-flex items-center gap-3 border-b border-[#292521] pb-2 text-[10px] tracking-[3px] transition hover:text-[#A18B70]">
          <ArrowLeft size={14} /> BACK TO COLLECTION
        </Link>
      </div>

      <BrandFooter />

      <AnimatePresence>
        {sizeGuideOpen ? <SizeGuide onClose={() => setSizeGuideOpen(false)} selectedSize={selectedSize} onSelect={setSelectedSize} /> : null}
        {zoomIndex !== null ? <ZoomViewer product={product} index={zoomIndex} onClose={() => setZoomIndex(null)} /> : null}
      </AnimatePresence>
    </main>
  );
}


/* -------------------------- Catalogue presentation data ------------------- */

export const TALA_CATALOGUE_METADATA = {
  brand: "TALA",
  language: "en",
  currency: STORE_CURRENCY,
  displayCurrency: "Egyptian Pound",
  productCount: PRODUCTS.length,
  categories: getInitialCategoryNames(),
  sizes: SIZE_LABELS,
  supportEmail: SUPPORT_EMAIL,
  supportHandle: SUPPORT_HANDLE,
  visualDirection: "beige / taupe / white wordmark",
  imageAspectRatio: "4:5",
};

export const TALA_PRODUCT_POLICIES = {
  stock: "Stock information must be confirmed by the store.",
  delivery: "Delivery times are confirmed after order review.",
  returns: "Return eligibility is subject to the published store policy.",
  payment: "Payment methods must be configured before accepting live orders.",
  privacy: "Customer information must be handled through a secure backend.",
};

export const TALA_SIZE_HELP = {
  XS: "A close, compact fit. Compare garment measurements before selecting.",
  S: "A small size. Fit may vary by design and fabric.",
  M: "A medium size. Compare bust, waist and hip measurements.",
  L: "A large size. Review the garment measurements for comfort.",
  XL: "An extra-large size. Check the individual product size chart.",
};

export const TALA_COLOR_GUIDE = [
  { name: "Classic Black", value: "#292521", description: "A deep neutral for versatile styling." },
  { name: "Soft Ivory", value: "#E8E0D5", description: "A warm light neutral." },
  { name: "Warm Taupe", value: "#A99A89", description: "A muted earth-inspired neutral." },
  { name: "Sand", value: "#B5A28C", description: "A soft beige shade." },
];

export const TALA_EDITORIAL_MESSAGES = [
  "Thoughtful details make a lasting impression.",
  "Build a wardrobe around pieces you love.",
  "Discover a considered approach to everyday style.",
  "A timeless edit for modern wardrobes.",
  "Find your next favourite piece with TALA.",
];

function getTalaProductBySku(sku: string): Product | undefined {
  return PRODUCTS.find((product) => product.sku.toLowerCase() === sku.toLowerCase());
}

function getTalaProductsByCategory(category: string): Product[] {
  if (category === "all") return [...PRODUCTS];
  return PRODUCTS.filter((product) => product.category.toLowerCase() === category.toLowerCase());
}

function getTalaProductsByPrice(minimum: number, maximum: number): Product[] {
  return PRODUCTS.filter((product) => product.price >= minimum && product.price <= maximum);
}

function searchTalaProducts(query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...PRODUCTS];
  return PRODUCTS.filter((product) => {
    const searchable = [
      product.name,
      product.category,
      product.description,
      product.material,
      product.fit,
      product.sku,
    ].join(" ").toLowerCase();
    return searchable.includes(normalized);
  });
}

function sortTalaProducts(
  products: Product[],
  sort: "featured" | "price-low" | "price-high" | "name"
): Product[] {
  const copy = [...products];
  if (sort === "price-low") return copy.sort((a, b) => a.price - b.price);
  if (sort === "price-high") return copy.sort((a, b) => b.price - a.price);
  if (sort === "name") return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => a.id - b.id);
}

function getTalaCategoryCounts(): Record<string, number> {
  return PRODUCTS.reduce<Record<string, number>>((counts, product) => {
    counts[product.category] = (counts[product.category] ?? 0) + 1;
    return counts;
  }, {});
}

function getTalaPriceStatistics(): {
  minimum: number;
  maximum: number;
  average: number;
} {
  const prices = PRODUCTS.map((product) => product.price);
  const total = prices.reduce((sum, price) => sum + price, 0);
  return {
    minimum: Math.min(...prices),
    maximum: Math.max(...prices),
    average: Math.round(total / Math.max(prices.length, 1)),
  };
}

function validateTalaVariant(
  product: Product,
  size: string,
  color: string,
  quantity: number
): string[] {
  const errors: string[] = [];
  if (!isValidSize(size, product)) errors.push("Choose a valid size.");
  if (!isValidColor(color, product)) errors.push("Choose a valid color.");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    errors.push(`Quantity must be between 1 and ${MAX_QUANTITY}.`);
  }
  if (!product.available) errors.push("This item is currently unavailable.");
  return errors;
}

function buildTalaProductShareText(product: Product): string {
  return `${product.name} — ${formatPrice(product.price)}. Discover it at TALA.`;
}

function getTalaProductStructuredData(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    category: product.category,
    image: product.images,
    offers: {
      "@type": "Offer",
      priceCurrency: STORE_CURRENCY,
      price: product.price,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

function getTalaProductRecommendations(product: Product, limit = 4): Product[] {
  return getRelatedProducts(product, clamp(limit, 1, 12));
}

function getTalaAvailableSizes(product: Product): string[] {
  return product.available ? [...product.sizes] : [];
}

function getTalaAvailableColors(product: Product): ProductColor[] {
  return product.available ? [...product.colors] : [];
}

function getTalaProductCardLabel(product: Product): string {
  return `${product.name} — ${formatPrice(product.price)}`;
}

function getTalaProductCanonicalPath(product: Product): string {
  return `/products/${product.id}`;
}

function getTalaProductImageSet(product: Product): string[] {
  return product.images.filter((image) => image.startsWith("https://"));
}

function getTalaProductHasBadge(product: Product): boolean {
  return Boolean(product.badge && product.badge.trim().length > 0);
}

function getTalaProductHasMultipleImages(product: Product): boolean {
  return product.images.length > 1;
}

function getTalaProductHasMultipleSizes(product: Product): boolean {
  return product.sizes.length > 1;
}

function getTalaProductHasMultipleColors(product: Product): boolean {
  return product.colors.length > 1;
}

function getTalaProductDisplayPrice(product: Product): string {
  return formatPrice(product.price);
}

function getTalaProductShortDescription(product: Product, maxLength = 110): string {
  if (product.description.length <= maxLength) return product.description;
  return `${product.description.slice(0, maxLength).trimEnd()}…`;
}

function getTalaProductSearchIndex(): Array<{
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
}> {
  return PRODUCTS.map(({ id, sku, name, category, price }) => ({
    id,
    sku,
    name,
    category,
    price,
  }));
}

export const TALA_PRODUCT_NOTE_01 = {
  productId: 1,
  title: "The Signature Dress",
  category: "Dresses",
  displayPrice: 1850,
  stylingNote: "Sculpted styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["the signature dress", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_02 = {
  productId: 2,
  title: "Classic Elegance",
  category: "Dresses",
  displayPrice: 1250,
  stylingNote: "Essential styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["classic elegance", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_03 = {
  productId: 3,
  title: "Modern Essential",
  category: "Tops",
  displayPrice: 1450,
  stylingNote: "Refined styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["modern essential", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_04 = {
  productId: 4,
  title: "The Timeless Set",
  category: "Sets",
  displayPrice: 1650,
  stylingNote: "Modern styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["the timeless set", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_05 = {
  productId: 5,
  title: "Soft Structure",
  category: "Outerwear",
  displayPrice: 2250,
  stylingNote: "Classic styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["soft structure", "outerwear", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_06 = {
  productId: 6,
  title: "Everyday Grace",
  category: "Tops",
  displayPrice: 950,
  stylingNote: "Soft styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["everyday grace", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_07 = {
  productId: 7,
  title: "Evening Muse",
  category: "Dresses",
  displayPrice: 2450,
  stylingNote: "Everyday styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["evening muse", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_08 = {
  productId: 8,
  title: "Minimal Form",
  category: "Sets",
  displayPrice: 1750,
  stylingNote: "Evening styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["minimal form", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_09 = {
  productId: 9,
  title: "Sculpted Form 09",
  category: "Dresses",
  displayPrice: 990,
  stylingNote: "Sculpted styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["sculpted form 09", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_10 = {
  productId: 10,
  title: "Essential Form 10",
  category: "Tops",
  displayPrice: 1190,
  stylingNote: "Essential styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["essential form 10", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_11 = {
  productId: 11,
  title: "Refined Look 11",
  category: "Sets",
  displayPrice: 1390,
  stylingNote: "Refined styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["refined look 11", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_12 = {
  productId: 12,
  title: "Modern Look 12",
  category: "Outerwear",
  displayPrice: 1590,
  stylingNote: "Modern styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["modern look 12", "outerwear", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_13 = {
  productId: 13,
  title: "Classic Piece 13",
  category: "Dresses",
  displayPrice: 1790,
  stylingNote: "Classic styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["classic piece 13", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_14 = {
  productId: 14,
  title: "Soft Piece 14",
  category: "Tops",
  displayPrice: 1990,
  stylingNote: "Soft styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["soft piece 14", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_15 = {
  productId: 15,
  title: "Everyday Set 15",
  category: "Sets",
  displayPrice: 2190,
  stylingNote: "Everyday styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["everyday set 15", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_16 = {
  productId: 16,
  title: "Evening Set 16",
  category: "Outerwear",
  displayPrice: 2390,
  stylingNote: "Evening styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["evening set 16", "outerwear", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_17 = {
  productId: 17,
  title: "Sculpted Silhouette 17",
  category: "Dresses",
  displayPrice: 990,
  stylingNote: "Sculpted styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["sculpted silhouette 17", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_18 = {
  productId: 18,
  title: "Essential Silhouette 18",
  category: "Tops",
  displayPrice: 1190,
  stylingNote: "Essential styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["essential silhouette 18", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_19 = {
  productId: 19,
  title: "Refined Layer 19",
  category: "Sets",
  displayPrice: 1390,
  stylingNote: "Refined styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["refined layer 19", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_20 = {
  productId: 20,
  title: "Modern Layer 20",
  category: "Outerwear",
  displayPrice: 1590,
  stylingNote: "Modern styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["modern layer 20", "outerwear", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_21 = {
  productId: 21,
  title: "Classic Statement 21",
  category: "Dresses",
  displayPrice: 1790,
  stylingNote: "Classic styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["classic statement 21", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_22 = {
  productId: 22,
  title: "Soft Statement 22",
  category: "Tops",
  displayPrice: 1990,
  stylingNote: "Soft styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["soft statement 22", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_23 = {
  productId: 23,
  title: "Everyday Edit 23",
  category: "Sets",
  displayPrice: 2190,
  stylingNote: "Everyday styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["everyday edit 23", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_24 = {
  productId: 24,
  title: "Evening Edit 24",
  category: "Outerwear",
  displayPrice: 2390,
  stylingNote: "Evening styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["evening edit 24", "outerwear", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_25 = {
  productId: 25,
  title: "Sculpted Form 25",
  category: "Dresses",
  displayPrice: 990,
  stylingNote: "Sculpted styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["sculpted form 25", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_26 = {
  productId: 26,
  title: "Essential Form 26",
  category: "Tops",
  displayPrice: 1190,
  stylingNote: "Essential styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["essential form 26", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_27 = {
  productId: 27,
  title: "Refined Look 27",
  category: "Sets",
  displayPrice: 1390,
  stylingNote: "Refined styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["refined look 27", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_28 = {
  productId: 28,
  title: "Modern Look 28",
  category: "Outerwear",
  displayPrice: 1590,
  stylingNote: "Modern styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["modern look 28", "outerwear", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_29 = {
  productId: 29,
  title: "Classic Piece 29",
  category: "Dresses",
  displayPrice: 1790,
  stylingNote: "Classic styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["classic piece 29", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_30 = {
  productId: 30,
  title: "Soft Piece 30",
  category: "Tops",
  displayPrice: 1990,
  stylingNote: "Soft styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["soft piece 30", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_31 = {
  productId: 31,
  title: "Everyday Set 31",
  category: "Sets",
  displayPrice: 2190,
  stylingNote: "Everyday styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["everyday set 31", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_32 = {
  productId: 32,
  title: "Evening Set 32",
  category: "Outerwear",
  displayPrice: 2390,
  stylingNote: "Evening styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["evening set 32", "outerwear", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_33 = {
  productId: 33,
  title: "Sculpted Silhouette 33",
  category: "Dresses",
  displayPrice: 990,
  stylingNote: "Sculpted styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["sculpted silhouette 33", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_34 = {
  productId: 34,
  title: "Essential Silhouette 34",
  category: "Tops",
  displayPrice: 1190,
  stylingNote: "Essential styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["essential silhouette 34", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_35 = {
  productId: 35,
  title: "Refined Layer 35",
  category: "Sets",
  displayPrice: 1390,
  stylingNote: "Refined styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["refined layer 35", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_36 = {
  productId: 36,
  title: "Modern Layer 36",
  category: "Outerwear",
  displayPrice: 1590,
  stylingNote: "Modern styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["modern layer 36", "outerwear", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_37 = {
  productId: 37,
  title: "Classic Statement 37",
  category: "Dresses",
  displayPrice: 1790,
  stylingNote: "Classic styling pairs naturally with simple accessories.",
  merchandisingGroup: "Seasonal Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["classic statement 37", "dresses", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_38 = {
  productId: 38,
  title: "Soft Statement 38",
  category: "Tops",
  displayPrice: 1990,
  stylingNote: "Soft styling pairs naturally with simple accessories.",
  merchandisingGroup: "Evening Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["soft statement 38", "tops", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_39 = {
  productId: 39,
  title: "Everyday Edit 39",
  category: "Sets",
  displayPrice: 2190,
  stylingNote: "Everyday styling pairs naturally with simple accessories.",
  merchandisingGroup: "Everyday Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["everyday edit 39", "sets", "tala", "fashion", "wardrobe"],
};

export const TALA_PRODUCT_NOTE_40 = {
  productId: 40,
  title: "Evening Edit 40",
  category: "Outerwear",
  displayPrice: 2390,
  stylingNote: "Evening styling pairs naturally with simple accessories.",
  merchandisingGroup: "Core Edit",
  recommendedCare: "Follow the garment care label and store the item in a clean, dry place.",
  customerServicePrompt: "Ask TALA about current availability, measurements and delivery options.",
  searchKeywords: ["evening edit 40", "outerwear", "tala", "fashion", "wardrobe"],
};
