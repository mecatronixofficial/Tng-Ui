import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FaArrowRight,
  FaBoxes,
  FaStore,
  FaTags,
  FaTruckMoving,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { loadCategories, loadProducts, loadSubcategories } from "@/lib/data";
import { siteConfig } from "@/data/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await loadCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.name} Category`,
    description: `${cat.description} Retail and wholesale cloth supply from ${siteConfig.name}.`,
  };
}

export default async function CategoryDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const { slug } = await params;
  const { sub } = await searchParams;

  const [categories, allProducts, subcategories] = await Promise.all([
    loadCategories(),
    loadProducts(),
    loadSubcategories(slug),
  ]);

  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const activeSub = subcategories.find((s) => s.slug === sub);

  const list = allProducts.filter((p) => {
    if (p.category !== slug) return false;
    if (activeSub) {
      const pSub = (p.subcategory ?? "").toLowerCase();
      return (
        pSub === activeSub.slug.toLowerCase() ||
        pSub === activeSub.name.toLowerCase()
      );
    }
    return true;
  });

  return (
    <>
      <PageHero
        eyebrow="Cloth category"
        title={`${cat.name} for retail and wholesale`}
        subtitle={cat.description}
        bgImage={cat.image}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: cat.name },
        ]}
      />

      <section className="border-b border-primary-100 bg-white">
        <div className="container-x grid gap-4 py-6 md:grid-cols-3">
          {[
            { label: "Retail shopping", Icon: FaStore },
            { label: "Wholesale stock", Icon: FaBoxes },
            { label: "Despatch support", Icon: FaTruckMoving },
          ].map(({ label, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-primary-100 bg-primary-50 p-4"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-white">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-extrabold text-primary-950">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-cream-50">
        <div className="container-x">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-secondary/30 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800 shadow-soft">
                <FaTags className="h-3 w-3 text-secondary" />
                {list.length} {list.length === 1 ? "product" : "products"}{" "}
                {activeSub ? `in ${activeSub.name}` : `in ${cat.name}`}
              </div>
              <h2 className="text-3xl font-extrabold leading-tight text-primary-950 md:text-4xl">
                Browse {activeSub ? activeSub.name : cat.name} cloth products
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
                Select a product for details, retail order support, or wholesale
                enquiry through WhatsApp.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
              >
                <FaWhatsapp className="h-4 w-4" />
                Ask on WhatsApp
              </a>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-5 py-3 text-sm font-bold text-primary-900 transition hover:border-secondary hover:text-secondary"
              >
                All products <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Subcategory filter tabs */}
          {subcategories.length > 0 && (
            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href={`/categories/${slug}`}
                className={`group flex min-h-[92px] items-center gap-3 overflow-hidden rounded-lg border p-3 text-sm font-bold transition ${
                  !activeSub
                    ? "border-primary-900 bg-primary-900 text-white shadow-soft"
                    : "border-primary-200 bg-white text-primary-800 hover:border-primary-900 hover:text-primary-900"
                }`}
              >
                <span className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-primary-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate">All {cat.name}</span>
                  <span className="mt-1 block text-xs font-semibold opacity-75">
                    {allProducts.filter((p) => p.category === slug).length} products
                  </span>
                </span>
              </Link>
              {subcategories.map((s) => (
                <Link
                  key={s.id}
                  href={`/categories/${slug}?sub=${s.slug}`}
                  className={`group flex min-h-[92px] items-center gap-3 overflow-hidden rounded-lg border p-3 text-sm font-bold transition ${
                    activeSub?.slug === s.slug
                      ? "border-secondary bg-secondary text-white shadow-soft"
                      : "border-primary-200 bg-white text-primary-800 hover:border-secondary hover:text-secondary"
                  }`}
                >
                  <span className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-primary-50">
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-xs font-black uppercase tracking-widest text-primary-300">
                        {s.name.slice(0, 2)}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{s.name}</span>
                    <span className="mt-1 block text-xs font-semibold opacity-75">
                      {s.productCount} {s.productCount === 1 ? "product" : "products"}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          {list.length === 0 ? (
            <div className="rounded-lg border border-primary-100 bg-white p-12 text-center shadow-soft">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-lg bg-primary-50 text-secondary">
                <FaBoxes className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-primary-950">
                Stock update coming soon
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
                We are updating this category. Message us on WhatsApp for
                current retail and wholesale availability.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
