import { useEffect, useState } from "react";
export interface TalaCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

const STORAGE_KEY = "tala-store-cart-v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function saveCart(items: TalaCartItem[]): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );

    window.dispatchEvent(new Event("tala-cart-updated"));
  } catch (error) {
    console.error("TALA: Could not save cart", error);
  }
}

export function getTalaCart(): TalaCartItem[] {
  if (!isBrowser()) return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is TalaCartItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number"
    );
  } catch {
    return [];
  }
}

export function addToTalaCart(
  item: TalaCartItem
): TalaCartItem[] {
  if (
    !item.id ||
    !item.name ||
    !Number.isFinite(item.price) ||
    item.price < 0 ||
    !Number.isInteger(item.quantity) ||
    item.quantity < 1
  ) {
    return getTalaCart();
  }

  const cart = getTalaCart();

  const existingIndex = cart.findIndex(
    (current) =>
      current.id === item.id &&
      current.size === item.size &&
      current.color === item.color
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push({ ...item });
  }

  saveCart(cart);
  return cart;
}

export function removeFromTalaCart(
  id: string,
  size?: string,
  color?: string
): TalaCartItem[] {
  const updated = getTalaCart().filter(
    (item) =>
      !(
        item.id === id &&
        item.size === size &&
        item.color === color
      )
  );

  saveCart(updated);
  return updated;
}

export function updateTalaCartQuantity(
  id: string,
  quantity: number,
  size?: string,
  color?: string
): TalaCartItem[] {
  const cart = getTalaCart();

  if (!Number.isInteger(quantity) || quantity < 1) {
    return removeFromTalaCart(id, size, color);
  }

  const updated = cart.map((item) =>
    item.id === id &&
    item.size === size &&
    item.color === color
      ? { ...item, quantity }
      : item
  );

  saveCart(updated);
  return updated;
}

export function clearTalaCart(): void {
  saveCart([]);
}

export function getTalaCartCount(): number {
  return getTalaCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function getTalaCartTotal(): number {
  return getTalaCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}
export function useCartCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setCount(getTalaCartCount());
    };

    updateCount();

    window.addEventListener("tala-cart-updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("tala-cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return count;
}
