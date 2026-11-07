
export const CART_STORAGE_KEY = "tala-cart";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

export type NewCartItem = Omit<CartItem, "id" | "quantity"> & {
  quantity?: number;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function notifyCartUpdated(): void {
  if (!isBrowser()) return;

  window.dispatchEvent(new Event("tala-cart-updated"));
}

export function getCart(): CartItem[] {
  if (!isBrowser()) return [];

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => {
      return (
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.productId === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0
      );
    });
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items)
    );

    notifyCartUpdated();
  } catch (error) {
    console.error("TALA: Unable to save shopping bag.", error);
  }
}

export function addToCart(item: NewCartItem): CartItem[] {
  if (!isBrowser()) return [];

  const cart = getCart();

  const quantity = Math.max(
    1,
    Math.min(10, Math.floor(item.quantity ?? 1))
  );

  const existingIndex = cart.findIndex(
    (existing) =>
      existing.productId === item.productId &&
      existing.size === item.size &&
      existing.color === item.color
  );

  let updatedCart: CartItem[];

  if (existingIndex !== -1) {
    updatedCart = cart.map((existing, index) => {
      if (index !== existingIndex) return existing;

      return {
        ...existing,
        quantity: Math.min(10, existing.quantity + quantity),
      };
    });
  } else {
    const newItem: CartItem = {
      ...item,
      id: `${item.productId}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      quantity,
    };

    updatedCart = [...cart, newItem];
  }

  saveCart(updatedCart);

  return updatedCart;
}

export function updateCartQuantity(
  itemId: string,
  quantity: number
): CartItem[] {
  const cart = getCart();

  const safeQuantity = Math.max(
    1,
    Math.min(10, Math.floor(quantity))
  );

  const updatedCart = cart.map((item) =>
    item.id === itemId
      ? { ...item, quantity: safeQuantity }
      : item
  );

  saveCart(updatedCart);

  return updatedCart;
}

export function removeFromCart(itemId: string): CartItem[] {
  const updatedCart = getCart().filter(
    (item) => item.id !== itemId
  );

  saveCart(updatedCart);

  return updatedCart;
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartCount(): number {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function getCartSubtotal(): number {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

export function isInCart(
  productId: string,
  size: string,
  color: string
): boolean {
  return getCart().some(
    (item) =>
      item.productId === productId &&
      item.size === size &&
      item.color === color
  );
}
