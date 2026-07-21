import type { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";

import CategoryCard from "@/components/CategoryCard";
import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import { loadCategories } from "@/lib/data";
import { siteConfig } from "@/data/site";

const banner =
  "/banners/a-picturesque-arrangement-of-cotton-fabric-in-a-rainbow-of-colors-with-expansive-copy-space-perfect-for-use-in-textile-industry-catalogs-or-creative-arts-flyers-free-photo.jpg";

export const metadata: Metadata = {
  title: "Categories",
  description: `${siteConfig.name} retail and wholesale cloth categories including petticoats, lungis, towels, gamcha, bed sheets, dhotis and handloom products.`,
  keywords: [
    "cloth categories Erode",
    "petticoat category",
    "lungi category",
    "towel wholesale",
    "gamcha wholesale",
    "bed sheet category",
    "dhoti category",
  ],
  alternates: { canonical: "/categories" },
  openGraph: {
    title: `Categories — ${siteConfig.name}`,
    description: `${siteConfig.name} retail and wholesale cloth categories including petticoats, lungis, towels, gamcha, bed sheets, dhotis and handloom products.`,
    url: "/categories",
    type: "website",
    images: [{ url: banner, width: 1200, height: 630, alt: "Thangavel Textile categories" }],
  },
};

export default async function CategoriesPage() {
  const categories = await loadCategories();
  return (
    <>
      <PageHero
        eyebrow="Cloth categories"
        title="Retail and wholesale cloth range."
        subtitle="Browse practical textile categories for home shopping, shop stock, repeat trade and bulk supply."
        bgImage={banner}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
      />

      <section className="section-y bg-cream-50">
        <div className="container-x">
          <SectionTitle
            eyebrow="Shop by cloth type"
            title="Categories made for retail counters and wholesale cartons."
            action={
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
              >
                <FaWhatsapp className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            }
          />

          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                href={`/categories/${cat.slug}`}
                index={i}
                rank={i + 1}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
