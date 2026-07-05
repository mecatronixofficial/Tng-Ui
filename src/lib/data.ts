/**
 * Public data layer for server components.
 *
 * Each loader fetches from the NestJS backend and returns only real API data.
 *
 * Important: these are server-side functions. Do not import from "use client"
 * components — use the client `api` helper from `@/lib/api` for that.
 */

import type {
  Category as CategoryType,
  Product as ProductType,
  Subcategory as SubcategoryType,
  HeroSlide,
  BlogPost,
  Testimonial,
  Offer,
  OpeningCardData,
  Faq,
} from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

const FETCH_TIMEOUT_MS = 25000;
const FETCH_RETRY_DELAY_MS = 500;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryFetch<T>(path: string): Promise<T | null> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      if (attempt === 1) return null;
      await delay(FETCH_RETRY_DELAY_MS);
    }
  }

  return null;
}

interface ApiPaginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; pages: number };
}

// ----- Mapping helpers (backend → frontend types) -----

function asArray<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function paginatedData<T = any>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    return asArray<T>((value as ApiPaginated<T>).data);
  }
  return [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function asSpecifications(value: unknown): ProductType["specifications"] {
  if (!Array.isArray(value)) return undefined;

  const specifications = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const label = asString(record.label).trim();
      const specValue = asString(record.value).trim();
      return label && specValue ? { label, value: specValue } : null;
    })
    .filter((item): item is { label: string; value: string } => Boolean(item));

  return specifications.length > 0 ? specifications : undefined;
}

function mapCategory(api: any): CategoryType {
  return {
    id: asString(api.id || api._id),
    name: asString(api.name, "Category"),
    slug: asString(api.slug),
    image: asString(api.image),
    description: asString(api.description),
    productCount: asNumber(api.productCount),
  };
}

function mapSubcategory(api: any): SubcategoryType {
  return {
    id: asString(api.id || api._id),
    name: asString(api.name, "Subcategory"),
    slug: asString(api.slug),
    category: asString(api.category),
    image: asString(api.image) || undefined,
    productCount: asNumber(api.productCount),
  };
}

function mapProduct(api: any): ProductType {
  return {
    id: asString(api.id || api._id),
    name: asString(api.name, "Product"),
    slug: asString(api.slug),
    category: asString(api.category, "Textiles"),
    subcategory: asString(api.subcategory) || undefined,
    images: asStringArray(api.images),
    description: asString(api.description),
    clothType: asString(api.clothType),
    colors: asStringArray(api.colors),
    sizes: asStringArray(api.sizes),
    stock: asNumber(api.stock),
    material: asString(api.material),
    gsm: asString(api.gsm) || undefined,
    pattern: asString(api.pattern) || undefined,
    washable: api.washable ?? true,
    featured: api.featured ?? false,
    newArrival: api.newArrival ?? false,
    rating: asNumber(api.rating, 4.5),
    reviews: asNumber(api.reviews),
    tags: asStringArray(api.tags),
    specifications: asSpecifications(api.specifications),
    retailEnabled: api.retailEnabled ?? true,
    wholesaleEnabled: api.wholesaleEnabled ?? true,
    bundleSize: asNumber(api.bundleSize, 12),
    allowMixedColors: api.allowMixedColors ?? false,
    allowMixedSizes: api.allowMixedSizes ?? false,
  };
}

function mapHero(api: any): HeroSlide {
  return {
    id: asString(api.id || api._id),
    eyebrow: asString(api.eyebrow),
    title: asString(api.title, "Thangavel Textile"),
    highlight: asString(api.highlight) || undefined,
    description: asString(api.description),
    image: asString(api.image),
    ctaLabel: asString(api.ctaLabel, "Shop products"),
    ctaHref: asString(api.ctaHref, "/products"),
    secondaryLabel: asString(api.secondaryLabel) || undefined,
    secondaryHref: asString(api.secondaryHref) || undefined,
  };
}

function mapBlog(api: any): BlogPost {
  return {
    id: asString(api.id || api._id),
    title: asString(api.title, "Cloth buying guide"),
    slug: asString(api.slug),
    excerpt: asString(api.excerpt),
    content: asString(api.content),
    coverImage: asString(api.coverImage),
    author: asString(api.author, "Thangavel Textile"),
    authorImage: asString(api.authorImage) || undefined,
    publishedAt: asString(api.publishedAt, new Date().toISOString()),
    category: asString(api.category, "Textiles"),
    tags: asStringArray(api.tags),
    readTime: asNumber(api.readTime, 5),
  };
}

function mapTestimonial(api: any): Testimonial {
  return {
    id: asString(api.id || api._id),
    name: asString(api.name, "Customer"),
    role: asString(api.role, "Customer"),
    company: asString(api.company) || undefined,
    location: asString(api.location),
    rating: asNumber(api.rating, 5),
    review: asString(api.review),
    image: asString(api.image) || undefined,
    productPurchased: asString(api.productPurchased) || undefined,
  };
}

function mapOffer(api: any): Offer {
  return {
    id: asString(api.id || api._id),
    title: asString(api.title, "Special offer"),
    description: asString(api.description),
    code: asString(api.code) || undefined,
    discountPercent: asNumber(api.discountPercent),
    expiresAt: asString(api.expiresAt),
    image: asString(api.image) || undefined,
    ctaLabel: asString(api.ctaLabel) || undefined,
    ctaHref: asString(api.ctaHref) || undefined,
  };
}

function mapOpening(api: any): OpeningCardData {
  return {
    enabled: true,
    title: asString(api.title, "Opening special"),
    subtitle: asString(api.subtitle),
    description: asString(api.description),
    image: asString(api.image),
    ctaLabel: asString(api.ctaLabel, "View products"),
    ctaHref: asString(api.ctaHref, "/products"),
    expiresAt: asString(api.expiresAt) || undefined,
    badge: asString(api.badge) || undefined,
  };
}

// ----- Public loaders -----

export async function loadCategories(): Promise<CategoryType[]> {
  const res = await tryFetch<any[]>("/categories");
  const rows = asArray(res);
  if (rows.length > 0) return rows.map(mapCategory);
  return [];
}

export async function loadSubcategories(category: string): Promise<SubcategoryType[]> {
  const res = await tryFetch<any[]>(`/subcategories?category=${encodeURIComponent(category)}`);
  const rows = asArray(res);
  if (rows.length > 0) return rows.map(mapSubcategory);
  return [];
}

export async function loadProducts(): Promise<ProductType[]> {
  const res = await tryFetch<ApiPaginated<any>>("/products?limit=100");
  const rows = paginatedData(res);
  if (rows.length > 0) return rows.map(mapProduct);
  return [];
}

export async function loadProductBySlug(slug: string): Promise<ProductType | null> {
  const res = await tryFetch<any>(`/products/${slug}`);
  if (res) return mapProduct(res);
  return null;
}

export async function loadRelatedProducts(slug: string): Promise<ProductType[]> {
  const res = await tryFetch<any[]>(`/products/${slug}/related`);
  const rows = asArray(res);
  if (rows.length > 0) return rows.map(mapProduct);
  return [];
}

export async function loadHeroSlides(): Promise<HeroSlide[]> {
  const res = await tryFetch<any[]>("/banners/hero");
  const rows = asArray(res);
  if (rows.length > 0) return rows.map(mapHero);
  return [];
}

export async function loadOpeningCard(): Promise<OpeningCardData | null> {
  const res = await tryFetch<any[]>("/banners/opening-card");
  const rows = asArray(res);
  if (rows.length > 0) return mapOpening(rows[0]);
  return null;
}

export async function loadBlogs(): Promise<BlogPost[]> {
  const res = await tryFetch<ApiPaginated<any>>("/blogs?limit=100");
  const rows = paginatedData(res);
  if (rows.length > 0) return rows.map(mapBlog);
  return [];
}

export async function loadBlogBySlug(slug: string): Promise<BlogPost | null> {
  const res = await tryFetch<any>(`/blogs/${slug}`);
  if (res) return mapBlog(res);
  return null;
}

export async function loadTestimonials(): Promise<Testimonial[]> {
  const res = await tryFetch<any[]>("/testimonials");
  const rows = asArray(res);
  if (rows.length > 0) return rows.map(mapTestimonial);
  return [];
}

export async function loadOffers(): Promise<Offer[]> {
  const res = await tryFetch<any[]>("/offers");
  const rows = asArray(res);
  if (rows.length > 0) return rows.map(mapOffer);
  return [];
}

function mapFaq(api: any): Faq {
  return {
    id: asString(api.id || api._id),
    question: asString(api.question, "Question"),
    answer: asString(api.answer),
  };
}

export async function loadFaqs(): Promise<Faq[]> {
  const res = await tryFetch<any[]>("/faqs");
  const rows = asArray(res);
  if (rows.length > 0) return rows.map(mapFaq);
  return [];
}
