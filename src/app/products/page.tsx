import type { Metadata } from "next";
import { Suspense } from "react";
import { FaBoxes, FaStore, FaTruckMoving } from "react-icons/fa";
import ProductsBrowser from "./ProductsBrowser";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Products |Retail & Wholesale Cloth Manufactures",
  description: `Browse ${siteConfig.name} retail and wholesale cloth products — petticoats, lungis, towels, gamcha, bed sheets, handloom and dhotis from Erode.`,
  keywords: [
  "cotton petticoat wholesale",
  "cotton petticoat wholesale Erode",
  "petticoat manufacturer in Erode",
  "lungi wholesale Erode",
  "cotton lungi wholesale",
  "lungi manufacturer in Erode",
  "towel manufacturer in Erode",
  "cotton towel wholesale",
  "cotton towel supplier Erode",
  "inskirt supplier in Erode",
  "cotton inskirt wholesale",
  "inskirts manufacturer in Erode",
  "bed sheet wholesale India",
  "cotton bed sheet wholesale",
  "bed sheet supplier in Erode",
  "dhoti manufacturer in Erode",
  "cotton dhoti wholesale",
  "dhoti supplier Erode",
  "textile wholesale supplier Erode",
  "textile manufacturer and wholesaler in Erode"
],
  alternates: { canonical: "/products" },
  openGraph: {
    title: `Retail & Wholesale Cloth Products — ${siteConfig.name}`,
    description: `Browse ${siteConfig.name} retail and wholesale cloth products — petticoats, lungis, towels, gamcha, bed sheets, handloom and dhotis from Erode.`,
    url: "/products",
    type: "website",
    images: [
      {
        url: "/banners/WhatsApp%20Image%202026-07-21%20at%2023.35.15.jpeg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} products`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Retail & Wholesale Cloth Products — ${siteConfig.name}`,
    description: `Browse ${siteConfig.name} retail and wholesale cloth products — petticoats, lungis, towels, gamcha, bed sheets, handloom and dhotis from Erode.`,
    images: ["/banners/WhatsApp%20Image%202026-07-21%20at%2023.35.15.jpeg"],
  },
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-cream-50 px-5">
          <div className="w-full max-w-sm rounded-lg border border-primary-100 bg-white p-5 shadow-warm">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary-600 text-white">
                <FaTruckMoving className="h-5 w-5 animate-pulse" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest-x text-secondary">
                  Loading products
                </div>
                <div className="mt-1 text-sm font-extrabold text-primary-950">
                  Retail and wholesale cloths
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-primary-50 p-3 text-xs font-bold text-primary-800">
                <FaStore className="mb-2 h-4 w-4 text-secondary" />
                Retail
              </div>
              <div className="rounded-lg bg-primary-50 p-3 text-xs font-bold text-primary-800">
                <FaBoxes className="mb-2 h-4 w-4 text-secondary" />
                Wholesale
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductsBrowser />
    </Suspense>
  );
}
