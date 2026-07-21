import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review items in your cart before sending a retail or wholesale enquiry.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
