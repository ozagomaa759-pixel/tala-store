
export const CART_STORAGE_KEY = "tala-cart";

const MAX_ITEM_QUANTITY = 10;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.productId === "string" &&
    UUID_REGEX.test(value.productId) &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    typeof value.image === "string" &&
    typeof value.size === "string" &&
    typeof value.color === "string" &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity >= 1 &&
    value.quantity <= MAX_ITEM_QUANTITY
  );
}

function notifyCartUpdated(): void {
  if (!isBrowser()) return;

  window.dispatchEvent(new Event("tala-cart-updated"));
}

function createItemId(): string {
  if (
    isBrowser() &&
    typeof window.crypto?.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getCart(): CartItem[] {
  if (!isBrowser()) return [];

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidCartItem);
  } catch (error) {
    console.error("TALA: Unable to read shopping bag.", error);
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (!isBrowser()) return;

  try {
    const safeItems = Array.isArray(items)
      ? items.filter(isValidCartItem)
      : [];

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(safeItems)
    );

    notifyCartUpdated();
  } catch (error) {
    console.error("TALA: Unable to save shopping bag.", error);
  }
}

export function addToCart(item: NewCartItem): CartItem[] {
  if (!isBrowser()) return [];

  const currentCart = getCart();

  if (
    !item ||
    !UUID_REGEX.test(item.productId) ||
    !item.name?.trim() ||
    !Number.isFinite(Number(item.price)) ||
    Number(item.price) < 0 ||
    typeof item.image !== "string" ||
    typeof item.size !== "string" ||
    typeof item.color !== "string"
  ) {
    return currentCart;
  }

  const requestedQuantity = Number(item.quantity ?? 1);

  if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
    return currentCart;
  }

  const quantity = Math.min(
    MAX_ITEM_QUANTITY,
    requestedQuantity
  );

  const existingIndex = currentCart.findIndex(
    (existing) =>
      existing.productId === item.productId &&
      existing.size === item.size &&
      existing.color === item.color
  );

  let updatedCart: CartItem[];

  if (existingIndex !== -1) {
    updatedCart = currentCart.map((existing, index) => {
      if (index !== existingIndex) return existing;

      return {
        ...existing,
        quantity: Math.min(
          MAX_ITEM_QUANTITY,
          existing.quantity + quantity
        ),
      };
    });
  } else {
    const newItem: CartItem = {
      id: createItemId(),
      productId: item.productId,
      name: item.name.trim(),
      price: Number(item.price),
      image: item.image,
      size: item.size,
      color: item.color,
      quantity,
    };

    updatedCart = [...currentCart, newItem];
  }

  saveCart(updatedCart);

  return updatedCart;
}

export function updateCartQuantity(
  itemId: string,
  quantity: number
): CartItem[] {
  const cart = getCart();

  if (!Number.isInteger(quantity)) return cart;

  const safeQuantity = Math.max(
    1,
    Math.min(MAX_ITEM_QUANTITY, quantity)
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
