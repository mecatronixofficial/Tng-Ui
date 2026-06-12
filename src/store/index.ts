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
