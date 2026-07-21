import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FaArrowRight,
  FaBoxes,
  FaCheck,
  FaFileInvoice,
  FaShieldAlt,
  FaStore,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import ProductGallery from "./ProductGallery";
import ProductActions from "./ProductActions";

import { loadProductBySlug, loadRelatedProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description?.slice(0, 160) ?? "",
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) ?? "",
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);
  if (!product) notFound();

  const related = await loadRelatedProducts(slug);
  const inStock = product.stock > 0;

  return (
    <>
      <PageHero
        title={product.name}
        eyebrow="Retail and wholesale product"
        subtitle={`${product.category}${product.subcategory ? ` · ${product.subcategory}` : ""}`}
        bgImage={product.images[0]}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      <section className="section-y bg-cream-50">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery images={product.images} name={product.name} />
            </div>

            {/* Info */}
            <div className="lg:col-span-5">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x">
                {(product.retailEnabled ?? true) && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1.5 text-primary-800">
                    <FaStore className="h-3 w-3 text-secondary" />
                    Retail
                  </span>
                )}
                {(product.wholesaleEnabled ?? true) && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1.5 text-secondary-dark">
                    <FaBoxes className="h-3 w-3" />
                    Wholesale
                  </span>
                )}
                <span className="rounded-md bg-white px-2.5 py-1.5 text-primary-800">
                  {product.category}
                </span>
                {product.subcategory && (
                  <span className="rounded-md bg-white px-2.5 py-1.5 text-ink-muted">{product.subcategory}</span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-primary-950 leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-ink-muted">
                <span className="text-secondary">
                  {"★".repeat(Math.min(5, Math.max(0, Math.round(product.rating ?? 4.5))))}
                  <span className="text-primary-200">
                    {"★".repeat(5 - Math.min(5, Math.max(0, Math.round(product.rating ?? 4.5))))}
                  </span>
                </span>
                <span>·</span>
                <span>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Stock */}
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm font-bold shadow-soft">
                <span
                  className={`h-2 w-2 rounded-full ${
                    inStock ? "bg-green-600" : "bg-red-600"
                  }`}
                />
                <span className={inStock ? "text-green-700" : "text-red-700"}>
                  {inStock
                    ? `In stock — ${product.stock} available`
                    : "Out of stock"}
                </span>
              </div>

              {/* Description */}
              <p className="mt-6 text-ink-soft leading-relaxed">
                {product.description}
              </p>

              {/* Actions (client) */}
              <div className="mt-8">
                <ProductActions product={product} />
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-2 gap-3 pt-8 border-t border-primary-100">
                {[
                  { Icon: FaTruck, label: "Pan-India delivery", sub: "Transport support" },
                  { Icon: FaShieldAlt, label: "Quality assured", sub: "Checked stock" },
                  { Icon: FaFileInvoice, label: "GST invoice", sub: "Trade ready" },
                  { Icon: FaCheck, label: "Retail + wholesale", sub: "Flexible quantity" },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-soft">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-secondary">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{label}</div>
                      <div className="text-xs text-ink-muted">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="section-y bg-white">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionTitle
              eyebrow="Details"
              title="Specifications"
            />
          </div>
          <div className="lg:col-span-7">
            <dl className="rounded-lg bg-white border border-primary-100 overflow-hidden divide-y divide-primary-100 shadow-soft">
              {[
                ["Material", product.material],
                product.gsm ? ["GSM", product.gsm] : null,
                product.pattern ? ["Pattern", product.pattern] : null,
                ["Cloth Type", product.clothType],
                ["Colors Available", product.colors.join(", ")],
                ["Sizes Available", product.sizes.join(", ")],
                ["Retail Orders", (product.retailEnabled ?? true) ? "Enabled" : "Disabled"],
                ["Wholesale Orders", (product.wholesaleEnabled ?? true) ? `Enabled (${product.bundleSize ?? 12} pieces per bundle)` : "Disabled"],
                (product.wholesaleEnabled ?? true) && product.allowMixedColors
                  ? ["Bulk Mixed Colors", "Enabled"]
                  : null,
                (product.wholesaleEnabled ?? true) && product.allowMixedSizes
                  ? ["Bulk Mixed Sizes", "Enabled"]
                  : null,
                ["Washable", product.washable ? "Yes — machine wash recommended" : "Dry clean only"],
                ["Country of Origin", "India (Erode, Tamil Nadu)"],
                ...(product.specifications?.map((s) => [s.label, s.value]) || []),
              ]
                .filter(Boolean)
                .map((row, i) => {
                  const [k, v] = row as [string, string];
                  return (
                    <div
                      key={`${k}-${i}`}
                      className="grid grid-cols-3 gap-4 p-5"
                    >
                      <dt className="text-sm font-bold text-primary-800 col-span-1">{k}</dt>
                      <dd className="text-sm text-ink font-semibold col-span-2">
                        {v}
                      </dd>
                    </div>
                  );
                })}
            </dl>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-y bg-cream-50">
          <div className="container-x">
            <SectionTitle
              eyebrow="You may also like"
              title="Related products"
              action={
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-wider-x font-bold text-primary-800 hover:text-secondary"
                >
                  View All <FaArrowRight className="h-3 w-3" />
                </Link>
              }
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-12">
        <div className="container-x">
          <div className="grid gap-6 rounded-lg bg-primary-900 p-6 text-white md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
                Need this cloth in bulk?
              </div>
              <h2 className="mt-2 text-2xl font-extrabold">
                Send quantity, colour and city for availability.
              </h2>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${encodeURIComponent(`Hello, I need wholesale availability for ${product.name}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary-dark"
            >
              <FaWhatsapp className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
