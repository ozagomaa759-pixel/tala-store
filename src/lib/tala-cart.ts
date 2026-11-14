
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
  getCartSubtotal,
  isInCart,
  saveCart,
  CART_STORAGE_KEY,
  type CartItem,
  type NewCartItem,
} from "@/lib/cart";

import { useEffect, useState } from "react";

export type TalaCartItem = CartItem;

export {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
  getCartSubtotal,
  isInCart,
  saveCart,
  CART_STORAGE_KEY,
};

export function getTalaCart(): TalaCartItem[] {
  return getCart();
}

export function addToTalaCart(item: NewCartItem): TalaCartItem[] {
  return addToCart(item);
}

export function removeFromTalaCart(itemId: string): TalaCartItem[] {
  return removeFromCart(itemId);
}

export function updateTalaCartQuantity(
  itemId: string,
  quantity: number
): TalaCartItem[] {
  return updateCartQuantity(itemId, quantity);
}

export function clearTalaCart(): void {
  clearCart();
}

export function getTalaCartCount(): number {
  return getCartCount();
}

export function getTalaCartTotal(): number {
  return getCartSubtotal();
}

export function useCartCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setCount(getCartCount());
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
