"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  items: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) =>
        set((s) => ({
          items: s.items.includes(id)
            ? s.items.filter((x) => x !== id)
            : [...s.items, id],
        })),
      has: (id) => get().items.includes(id),
      clear: () => set({ items: [] }),
    }),
    { name: "tt-wishlist" }
  )
);

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  slug: string;
  image?: string;
  color?: string;
  size?: string;
  mode: "retail" | "wholesale";
  quantity: number;
  bundleSize?: number;
}

type CartInput = Omit<CartItem, "key">;

function cartKey(item: Pick<CartItem, "productId" | "mode" | "color" | "size">) {
  return [item.productId, item.mode, item.color || "", item.size || ""].join("::");
}

interface CartStore {
  items: CartItem[];
  add: (item: CartInput) => void;
  remove: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const key = cartKey(item);
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, key }] };
        }),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      updateQuantity: (key, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "tt-cart" }
  )
);

interface UIStore {
  openingCardDismissed: boolean;
  dismissOpeningCard: () => void;
  resetOpeningCard: () => void;
}

export const useUI = create<UIStore>()(
  persist(
    (set) => ({
      openingCardDismissed: false,
      dismissOpeningCard: () => set({ openingCardDismissed: true }),
      resetOpeningCard: () => set({ openingCardDismissed: false }),
    }),
    { name: "tt-ui" }
  )
);
