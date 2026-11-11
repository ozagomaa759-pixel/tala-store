
export const TALA_BRAND = {
  name: "TALA",
  tagline: "Elegance in Every Detail",
  description: "Discover timeless pieces designed for your everyday elegance.",
  currency: "EGP",
  locale: "en",
  logoColor: "#FFFFFF",
  background: "#F4F0E9",
  foreground: "#29251F",
  accent: "#A68B70",
  accentDark: "#75604C",
};

export const TALA_NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const TALA_CATEGORIES = [
  { id: "all", name: "All Products", href: "/products" },
  { id: "new", name: "New Arrivals", href: "/collections/new-arrivals" },
  { id: "dresses", name: "Dresses", href: "/categories/dresses" },
  { id: "tops", name: "Tops", href: "/categories/tops" },
  { id: "sets", name: "Sets", href: "/categories/sets" },
];

export const TALA_POLICIES = {
  shipping: "Shipping information will be confirmed at checkout.",
  returns: "Return requests are subject to TALA return policy.",
  privacy: "Your personal information should be handled securely.",
  support: "Our support team is here to help.",
};

export const TALA_ANIMATION = {
  fast: 180,
  normal: 350,
  slow: 600,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
};

export const TALA_THEME = {
  light: {
    background: "#F4F0E9",
    surface: "#FBF9F5",
    text: "#29251F",
    muted: "#887F73",
    border: "#E5DED3",
    accent: "#A68B70",
  },
  dark: {
    background: "#211E1A",
    surface: "#2B2722",
    text: "#F5F0E8",
    muted: "#B7AA9B",
    border: "#494137",
    accent: "#C4A889",
  },
};

export function formatTalaPrice(price: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: TALA_BRAND.currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getTalaNavigation() {
  return TALA_NAVIGATION;
}

export function getTalaCategory(categoryId: string) {
  return TALA_CATEGORIES.find(
    (category) => category.id === categoryId
  );
}

