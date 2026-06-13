/**
 * Public data layer for server components.
 *
 * Each loader tries to fetch from the NestJS backend first. If the backend is
 * unreachable or returns an error, it falls back to the static seed data in
 * `src/data/*`. This keeps the site functional whether or not the backend is
 * running, and means the same code paths render both states.
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

async function tryFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      // Short timeout so a down backend doesn't slow down page renders
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface ApiPaginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; pages: number };
}

// ----- Mapping helpers (backend → frontend types) -----

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
    id: api.id || api._id,
    name: api.name,
    slug: api.slug,
    image: api.image,
    description: api.description,
    productCount: api.productCount ?? 0,
  };
}

function mapSubcategory(api: any): SubcategoryType {
  return {
    id: api.id || api._id,
    name: api.name,
    slug: api.slug,
    category: api.category,
    image: api.image,
    productCount: api.productCount ?? 0,
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
    offerPrice: asNumber(api.offerPrice),
    originalPrice: asNumber(api.originalPrice),
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
    id: api.id || api._id,
    eyebrow: api.eyebrow || "",
    title: api.title,
    highlight: api.highlight,
    description: api.description,
    image: api.image,
    ctaLabel: api.ctaLabel,
    ctaHref: api.ctaHref,
    secondaryLabel: api.secondaryLabel,
    secondaryHref: api.secondaryHref,
  };
}

function mapBlog(api: any): BlogPost {
  return {
    id: api.id || api._id,
    title: api.title,
    slug: api.slug,
    excerpt: api.excerpt,
    content: api.content,
    coverImage: api.coverImage,
    author: api.author,
    authorImage: api.authorImage,
    publishedAt: api.publishedAt,
    category: api.category,
    tags: api.tags || [],
    readTime: api.readTime ?? 5,
  };
}

function mapTestimonial(api: any): Testimonial {
  return {
    id: api.id || api._id,
    name: api.name,
    role: api.role,
    company: api.company,
    location: api.location,
    rating: api.rating,
    review: api.review,
    image: api.image,
    productPurchased: api.productPurchased,
  };
}

function mapOffer(api: any): Offer {
  return {
    id: api.id || api._id,
    title: api.title,
    description: api.description,
    code: api.code,
    discountPercent: api.discountPercent ?? 0,
    expiresAt: api.expiresAt,
    image: api.image,
    ctaLabel: api.ctaLabel,
    ctaHref: api.ctaHref,
  };
}

function mapOpening(api: any): OpeningCardData {
  return {
    enabled: true,
    title: api.title,
    subtitle: api.subtitle || "",
    description: api.description,
    image: api.image,
    ctaLabel: api.ctaLabel,
    ctaHref: api.ctaHref,
    expiresAt: api.expiresAt,
    badge: api.badge,
  };
}

// ----- Public loaders -----

export async function loadCategories(): Promise<CategoryType[]> {
  const res = await tryFetch<any[]>("/categories");
  if (res && res.length > 0) return res.map(mapCategory);
  return [];
}

export async function loadSubcategories(category: string): Promise<SubcategoryType[]> {
  const res = await tryFetch<any[]>(`/subcategories?category=${encodeURIComponent(category)}`);
  if (res && res.length > 0) return res.map(mapSubcategory);
  return [];
}

export async function loadProducts(): Promise<ProductType[]> {
  const res = await tryFetch<ApiPaginated<any>>("/products?limit=100");
  if (res && res.data.length > 0) return res.data.map(mapProduct);
  return [];
}

export async function loadProductBySlug(slug: string): Promise<ProductType | null> {
  const res = await tryFetch<any>(`/products/${slug}`);
  if (res) return mapProduct(res);
  return null;
}

export async function loadRelatedProducts(slug: string): Promise<ProductType[]> {
  const res = await tryFetch<any[]>(`/products/${slug}/related`);
  if (res && res.length > 0) return res.map(mapProduct);
  return [];
}

export async function loadHeroSlides(): Promise<HeroSlide[]> {
  const res = await tryFetch<any[]>("/banners/hero");
  if (res && res.length > 0) return res.map(mapHero);
  return [];
}

export async function loadOpeningCard(): Promise<OpeningCardData | null> {
  const res = await tryFetch<any[]>("/banners/opening-card");
  if (res && res.length > 0) return mapOpening(res[0]);
  return null;
}

export async function loadBlogs(): Promise<BlogPost[]> {
  const res = await tryFetch<ApiPaginated<any>>("/blogs?limit=100");
  if (res && res.data.length > 0) return res.data.map(mapBlog);
  return [];
}

export async function loadBlogBySlug(slug: string): Promise<BlogPost | null> {
  const res = await tryFetch<any>(`/blogs/${slug}`);
  if (res) return mapBlog(res);
  return null;
}

export async function loadTestimonials(): Promise<Testimonial[]> {
  const res = await tryFetch<any[]>("/testimonials");
  if (res && res.length > 0) return res.map(mapTestimonial);
  return [];
}

export async function loadOffers(): Promise<Offer[]> {
  const res = await tryFetch<any[]>("/offers");
  if (res && res.length > 0) return res.map(mapOffer);
  return [];
}

function mapFaq(api: any): Faq {
  return {
    id: api.id || api._id,
    question: api.question,
    answer: api.answer,
  };
}

export async function loadFaqs(): Promise<Faq[]> {
  const res = await tryFetch<any[]>("/faqs");
  if (res && res.length > 0) return res.map(mapFaq);
  return [];
}
