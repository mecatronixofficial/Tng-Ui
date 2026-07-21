import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "Saved products for later — retail and wholesale cloth from Thangavel Textile.",
  robots: { index: false, follow: false },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
