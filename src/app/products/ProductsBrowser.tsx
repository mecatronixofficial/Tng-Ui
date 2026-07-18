"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBoxes,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaStore,
  FaTags,
  FaTimes,
  FaTruckMoving,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { siteConfig } from "@/data/site";
import { api, type ProductApi, type CategoryApi, type SubcategoryApi } from "@/lib/api";
import { cn } from "@/utils";

type SortKey = "featured" | "rating" | "newest";
type BuyerMode = "all" | "retail" | "wholesale";
type CategoryLike = Pick<CategoryApi, "id" | "name" | "slug">;
type SubcategoryLike = Pick<SubcategoryApi, "id" | "name" | "slug" | "category">;

const PRODUCTS_PER_PAGE = 30;

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured stock" },
  { value: "newest", label: "New arrivals" },
  { value: "rating", label: "Top rated" },
];

const buyerModes: { value: BuyerMode; label: string; Icon: typeof FaStore }[] = [
  { value: "all", label: "All cloths", Icon: FaTags },
  { value: "retail", label: "Retail picks", Icon: FaStore },
  { value: "wholesale", label: "Wholesale ready", Icon: FaBoxes },
];

function normalizeValue(value: unknown) {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return normalizeValue(record.slug || record.name || record.id || record._id);
  }

  return String(value ?? "").trim().toLowerCase();
}

function matchesAny(value: unknown, options: unknown[]) {
  const normalized = normalizeValue(value);
  return Boolean(normalized) && options.some((option) => normalizeValue(option) === normalized);
}

function productMatchesCategory(product: ProductApi, category: CategoryLike | string) {
  if (typeof category === "string") {
    return matchesAny(product.category, [category]);
  }

  return matchesAny(product.category, [category.slug, category.name, category.id]);
}

function subcategoryMatchesCategory(subcategory: SubcategoryLike, category: CategoryLike | string) {
  if (typeof category === "string") {
    return matchesAny(subcategory.category, [category]);
  }

  return matchesAny(subcategory.category, [category.slug, category.name, category.id]);
}

function productMatchesSubcategory(product: ProductApi, subcategory: SubcategoryLike | string) {
  if (typeof subcategory === "string") {
    return matchesAny(product.subcategory, [subcategory]);
  }

  return matchesAny(product.subcategory, [subcategory.slug, subcategory.name, subcategory.id]);
}

function mergeSubcategories(current: SubcategoryApi[], incoming: SubcategoryApi[]) {
  const merged = new Map<string, SubcategoryApi>();
  [...current, ...incoming].forEach((subcategory) => {
    const key = subcategory.id || subcategory.slug || subcategory.name;
    if (key) merged.set(key, subcategory);
  });
  return Array.from(merged.values());
}

async function fetchAllProducts() {
  const firstPage = await api.publicProducts("page=1&limit=100");
  if (firstPage.meta.pages <= 1) return firstPage.data;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.meta.pages - 1 }, (_, index) =>
      api.publicProducts(`page=${index + 2}&limit=100`),
    ),
  );

  return [firstPage.data, ...remainingPages.map((page) => page.data)].flat();
}

export default function ProductsPage() {
  const params = useSearchParams();
  const initialCategory = params.get("category") || "all";
  const initialSubcategory = params.get("subcategory") || "all";

  const [products, setProducts] = useState<ProductApi[]>([]);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [buyerMode, setBuyerMode] = useState<BuyerMode>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetchAllProducts(),
      api.publicCategories().catch(() => []),
      api.publicSubcategories().catch(() => []),
      initialCategory !== "all"
        ? api.publicSubcategories(initialCategory).catch(() => [])
        : Promise.resolve([]),
    ])
      .then(([productRows, categoryRows, subcategoryRows, selectedSubcategoryRows]) => {
        if (!mounted) return;
        setProducts(productRows);
        setCategories(categoryRows);
        setSubcategories(mergeSubcategories(subcategoryRows, selectedSubcategoryRows));
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setCategory(params.get("category") || "all");
    setSubcategory(params.get("subcategory") || "all");
  }, [params]);

  useEffect(() => {
    if (category === "all") return;
    api
      .publicSubcategories(category)
      .then((rows) => setSubcategories((current) => mergeSubcategories(current, rows)))
      .catch(() => {});
  }, [category]);

  const subcategoryByValue = useMemo(
    () =>
      new Map(
        subcategories.flatMap((s) => [
          [s.slug, s.name],
          [s.name, s.name],
          [s.id, s.name],
        ]),
      ),
    [subcategories],
  );

  const activeCategory = useMemo(
    () =>
      categories.find((c) => matchesAny(category, [c.slug, c.name, c.id])),
    [categories, category],
  );

  const activeSubcategory = useMemo(
    () =>
      subcategories.find((s) => matchesAny(subcategory, [s.slug, s.name, s.id])),
    [subcategories, subcategory],
  );

  const visibleSubcategories = useMemo(
    () =>
      subcategories.filter(
        (s) =>
          category === "all" ||
          subcategoryMatchesCategory(s, activeCategory || category),
      ),
    [activeCategory, category, subcategories],
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") {
      list = list.filter((p) => productMatchesCategory(p, activeCategory || category));
    }
    if (subcategory !== "all") {
      list = list.filter((p) =>
        productMatchesSubcategory(p, activeSubcategory || subcategory),
      );
    }
    if (buyerMode === "retail") list = list.filter((p) => !p.featured || p.stock < 100);
    if (buyerMode === "wholesale") {
      list = list.filter((p) => p.stock >= 100 || p.featured);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.material.toLowerCase().includes(q) ||
          normalizeValue(p.category).includes(q) ||
          normalizeValue(p.subcategory).includes(q) ||
          (p.subcategory
            ? subcategoryByValue.get(String(p.subcategory))?.toLowerCase().includes(q)
            : false),
      );
    }

    switch (sort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [
    products,
    category,
    activeCategory,
    subcategory,
    activeSubcategory,
    buyerMode,
    search,
    sort,
    subcategoryByValue,
  ]);

  const productCountForCategory = (value: CategoryLike | string) =>
    products.filter((p) => productMatchesCategory(p, value)).length;

  const productCountForSubcategory = (value: SubcategoryLike | string) =>
    products.filter((p) => productMatchesSubcategory(p, value)).length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );
  const visiblePageNumbers = Array.from(
    new Set(
      [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(
        (page) => page >= 1 && page <= totalPages,
      ),
    ),
  ).sort((a, b) => a - b);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, subcategory, buyerMode, search, sort]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    window.requestAnimationFrame(() => {
      document
        .getElementById("product-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <PageHero
        eyebrow="Cloth catalogue"
        title="Retail and wholesale cloth products."
        subtitle="Browse petticoats, lungis, towels, gamcha, bed sheets, handloom and dhotis for home use, shop stock and bulk supply."
        bgImage="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1920&auto=format&fit=crop&q=80"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <section className="border-b border-primary-100 bg-white">
        <div className="container-x grid gap-3 py-6 md:grid-cols-3">
          {[
            { label: "Retail shopping", Icon: FaStore },
            { label: "Wholesale supply", Icon: FaBoxes },
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
          {loading ? (
            <div className="grid min-h-[360px] place-items-center rounded-lg border border-primary-100 bg-white p-10 text-center shadow-soft">
              <div>
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-100 border-t-secondary" />
                <h2 className="mt-5 text-2xl font-extrabold text-primary-950">
                  Loading products
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Fetching your uploaded product details.
                </p>
              </div>
            </div>
          ) : (
          <>
          <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cloths, material, category..."
                className="w-full rounded-lg border border-primary-100 bg-white py-3 pl-11 pr-5 text-sm text-ink shadow-soft transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/10 lg:w-[520px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide text-primary-800 lg:hidden"
              >
                <FaFilter className="h-3 w-3" /> Filters
              </button>
              <span className="rounded-lg bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide text-primary-800 shadow-soft">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm font-semibold text-ink shadow-soft focus:border-secondary focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <aside
              className={cn(
                "lg:col-span-3 lg:block",
                showFilters
                  ? "fixed inset-0 z-40 overflow-y-auto bg-cream-50 p-5"
                  : "hidden",
              )}
            >
              <div className="mb-5 flex items-center justify-between lg:hidden">
                <h3 className="text-2xl font-extrabold text-primary-950">
                  Product filters
                </h3>
                <button onClick={() => setShowFilters(false)} aria-label="Close">
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                <FilterPanel title="Buyer type">
                  <div className="grid gap-2">
                    {buyerModes.map(({ value, label, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setBuyerMode(value)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm font-bold transition",
                          buyerMode === value
                            ? "border-secondary bg-secondary text-white"
                            : "border-primary-100 bg-white text-primary-950 hover:border-secondary",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </FilterPanel>

                <FilterPanel title="Category">
                  <div className="space-y-1">
                    <FilterButton
                      active={category === "all"}
                      label="All Products"
                      count={products.length}
                      onClick={() => {
                        setCategory("all");
                        setSubcategory("all");
                      }}
                    />
                    {categories.map((c) => (
                      <FilterButton
                        key={c.id}
                        active={activeCategory?.id === c.id}
                        label={c.name}
                        count={c.productCount || productCountForCategory(c)}
                        onClick={() => {
                          setCategory(c.slug);
                          setSubcategory("all");
                        }}
                      />
                    ))}
                  </div>
                </FilterPanel>

                {visibleSubcategories.length > 0 && (
                  <FilterPanel title="Subcategory">
                    <div className="space-y-1">
                      <FilterButton
                        active={subcategory === "all"}
                        label="All Subcategories"
                        count={
                          category === "all"
                            ? products.length
                            : productCountForCategory(activeCategory || category)
                        }
                        onClick={() => setSubcategory("all")}
                      />
                      {visibleSubcategories.map((s) => (
                        <FilterButton
                          key={s.id}
                          active={activeSubcategory?.id === s.id}
                          label={s.name}
                          image={s.image}
                          count={s.productCount || productCountForSubcategory(s)}
                          onClick={() => setSubcategory(s.slug)}
                        />
                      ))}
                    </div>
                  </FilterPanel>
                )}

                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Ask on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setCategory("all");
                    setSubcategory("all");
                    setBuyerMode("all");
                    setSearch("");
                    setSort("featured");
                    setShowFilters(false);
                  }}
                  className="w-full rounded-lg border border-primary-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide text-primary-800 transition hover:border-secondary hover:text-secondary"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            <div id="product-results" className="scroll-mt-24 lg:col-span-9">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border border-primary-100 bg-white p-12 text-center shadow-soft"
                  >
                    <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-lg bg-primary-50 text-secondary">
                      <FaBoxes className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-primary-950">
                      No cloth products match your filters
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">
                      Try another category or message us for current retail and wholesale stock.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    className="grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-3"
                  >
                    {paginatedProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {filtered.length > 0 && totalPages > 1 && (
                <nav
                  aria-label="Product pagination"
                  className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border border-primary-100 bg-white p-4 shadow-soft sm:flex-row"
                >
                  <p className="text-xs font-bold text-ink-muted">
                    Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
                    {Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length)} of {filtered.length}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-primary-100 text-primary-700 transition hover:border-primary-300 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <FaChevronLeft className="h-3 w-3" />
                    </button>

                    {visiblePageNumbers.map((page, index) => (
                      <span key={page} className="flex items-center gap-1.5">
                        {index > 0 && page - visiblePageNumbers[index - 1] > 1 && (
                          <span className="px-1 text-xs text-ink-muted">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => goToPage(page)}
                          aria-label={`Page ${page}`}
                          aria-current={page === currentPage ? "page" : undefined}
                          className={cn(
                            "grid h-9 min-w-9 place-items-center rounded-lg px-2 text-xs font-black transition",
                            page === currentPage
                              ? "bg-primary-700 text-white shadow-soft"
                              : "border border-primary-100 text-primary-700 hover:border-primary-300 hover:bg-primary-50",
                          )}
                        >
                          {page}
                        </button>
                      </span>
                    ))}

                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-primary-100 text-primary-700 transition hover:border-primary-300 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <FaChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </nav>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      </section>
    </>
  );
}

function FilterPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-primary-100 bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
        <FaTags className="h-3 w-3 text-secondary" />
        {title}
      </div>
      {children}
    </div>
  );
}

function FilterButton({
  active,
  label,
  image,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  image?: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition",
        active
          ? "bg-secondary text-white"
          : "text-ink-soft hover:bg-primary-50 hover:text-primary-800",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {image && (
          <span className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-primary-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="h-full w-full object-cover" />
          </span>
        )}
        <span className="truncate">{label}</span>
      </span>
      <span className="text-xs opacity-75">{count}</span>
    </button>
  );
}
