"use client";

import { optimizeImageForUpload, uploadToCloudinary } from "@/lib/cloudinary";

const CONFIGURED_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
const TOKEN_KEY = "tt-admin-token";

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function getBaseUrl() {
  if (typeof window === "undefined") return CONFIGURED_BASE;

  try {
    const configured = new URL(CONFIGURED_BASE, window.location.origin);

    if (
      configured.origin !== window.location.origin &&
      isLocalHost(configured.hostname) &&
      !isLocalHost(window.location.hostname)
    ) {
      return configured.pathname.replace(/\/$/, "");
    }
  } catch {
    // Relative API bases like "/api/v1" are already safe for shared devices.
  }

  return CONFIGURED_BASE.replace(/\/$/, "");
}

function canUploadDirectlyToCloudinary() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  );
}

function isUploadFallbackError(error: unknown) {
  return (
    !(error instanceof ApiError) ||
    error.status === 400 ||
    error.status === 404 ||
    error.status === 413 ||
    error.status >= 500
  );
}

function toUploadedImage(item: Awaited<ReturnType<typeof uploadToCloudinary>>): UploadedImage {
  return {
    url: item.secure_url,
    publicId: item.public_id,
    width: item.width,
    height: item.height,
    format: item.format,
    bytes: item.bytes,
  };
}

async function uploadToBackend(file: File) {
  const form = new FormData();
  form.append("file", file);

  return request<UploadedImage>("/admin/uploads/image", {
    method: "POST",
    body: form,
    multipart: true,
  });
}

async function uploadPreparedImage(file: File): Promise<UploadedImage> {
  if (canUploadDirectlyToCloudinary()) {
    try {
      return toUploadedImage(await uploadToCloudinary(file));
    } catch (cloudinaryError) {
      try {
        return await uploadToBackend(file);
      } catch (backendError) {
        if (isUploadFallbackError(backendError)) throw cloudinaryError;
        throw backendError;
      }
    }
  }

  try {
    return await uploadToBackend(file);
  } catch (error) {
    if (!isUploadFallbackError(error) || !canUploadDirectlyToCloudinary()) {
      throw error;
    }

    return toUploadedImage(await uploadToCloudinary(file));
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        results[currentIndex] = await mapper(items[currentIndex], currentIndex);
      }
    }),
  );

  return results;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public payload?: unknown) {
    super(message);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

interface RequestOpts {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** If true, includes Authorization header from local storage. Default true. */
  auth?: boolean;
  /** If true, send as multipart/form-data (body must be FormData). */
  multipart?: boolean;
}

async function request<T = any>(path: string, opts: RequestOpts = {}): Promise<T> {
  const { method = "GET", body, auth = true, multipart = false } = opts;
  const headers: Record<string, string> = {};
  if (!multipart && body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${getBaseUrl()}${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : multipart
          ? (body as BodyInit)
          : JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    throw new Error(
      error instanceof TypeError
        ? "Cannot reach the backend. Check that the backend server is running and that this device can access the site host."
        : "Request failed before the server responded.",
    );
  }

  let payload: any = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    const msg = Array.isArray(payload?.message)
      ? payload.message.join(", ")
      : payload?.message || res.statusText || "Request failed";
    throw new ApiError(res.status, msg, payload);
  }

  return payload as T;
}

export interface SubmitReviewInput {
  name: string;
  role: string;
  company?: string;
  location: string;
  rating: number;
  review: string;
  productPurchased?: string;
}

// Auth
export const api = {
  // --- Auth
  login: (email: string, password: string) =>
    request<{ accessToken: string; user: AdminUser }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),

  me: () => request<AdminUser>("/auth/me"),

  updateProfile: (body: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) =>
    request<AdminUser>("/auth/profile", { method: "PATCH", body }),

  forgotPassword: (email: string) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
      auth: false,
    }),

  verifyOtp: (email: string, otp: string) =>
    request<{ message: string; resetToken?: string }>("/auth/verify-otp", {
      method: "POST",
      body: { email, otp },
      auth: false,
    }),

  resetPassword: (resetToken: string, newPassword: string) =>
    request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: { resetToken, newPassword },
      auth: false,
    }),

  // --- Public (used by site visitors and admin lists)
  publicProducts: (search?: string) =>
    request<Paginated<ProductApi>>(
      `/products${search ? `?${search}` : ""}`,
      { auth: false },
    ),
  publicProductBySlug: (slug: string) =>
    request<ProductApi>(`/products/${slug}`, { auth: false }),
  publicCategories: () => request<CategoryApi[]>("/categories", { auth: false }),
  publicSubcategories: (category?: string) =>
    request<SubcategoryApi[]>(
      `/subcategories${category ? `?category=${encodeURIComponent(category)}` : ""}`,
      { auth: false },
    ),
  publicBlogs: () => request<Paginated<BlogApi>>("/blogs", { auth: false }),
  publicBlogBySlug: (slug: string) =>
    request<BlogApi>(`/blogs/${slug}`, { auth: false }),
  publicTestimonials: () =>
    request<TestimonialApi[]>("/testimonials", { auth: false }),
  submitReview: (data: SubmitReviewInput) =>
    request<{ message: string }>("/testimonials/submit", {
      method: "POST",
      body: data,
      auth: false,
    }),
  publicOffers: () => request<OfferApi[]>("/offers", { auth: false }),
  publicFaqs: () => request<FaqApi[]>("/faqs", { auth: false }),
  publicHeroBanners: () => request<BannerApi[]>("/banners/hero", { auth: false }),
  publicOpeningCard: () =>
    request<BannerApi[]>("/banners/opening-card", { auth: false }),
  visitorCount: () => request<VisitorCount>("/visitors", { auth: false }),
  trackVisitor: () => request<VisitorCount>("/visitors/track", { method: "POST", auth: false }),

  submitOrder: (data: SubmitOrderInput) =>
    request<OrderApi>("/orders", { method: "POST", body: data, auth: false }),

  // --- Admin: stats
  stats: () => request<DashboardStats>("/admin/stats/dashboard"),

  // --- Admin: products
  adminProducts: (query?: string) =>
    request<Paginated<ProductApi>>(
      `/admin/products${query ? `?${query}` : ""}`,
    ),
  adminProductById: (id: string) => request<ProductApi>(`/admin/products/${id}`),
  createProduct: (body: any) =>
    request<ProductApi>("/admin/products", { method: "POST", body }),
  bulkProducts: (body: { products: any[]; updateExisting?: boolean }) =>
    request<BulkProductImportResult>("/admin/products/bulk", {
      method: "POST",
      body,
    }),
  updateProduct: (id: string, body: any) =>
    request<ProductApi>(`/admin/products/${id}`, { method: "PATCH", body }),
  deleteProduct: (id: string) =>
    request<{ deleted: boolean }>(`/admin/products/${id}`, { method: "DELETE" }),

  // --- Admin: categories
  adminCategories: () => request<CategoryApi[]>("/admin/categories"),
  adminCategoryById: (id: string) => request<CategoryApi>(`/admin/categories/${id}`),
  createCategory: (body: any) =>
    request<CategoryApi>("/admin/categories", { method: "POST", body }),
  updateCategory: (id: string, body: any) =>
    request<CategoryApi>(`/admin/categories/${id}`, { method: "PATCH", body }),
  deleteCategory: (id: string) =>
    request<{ deleted: boolean }>(`/admin/categories/${id}`, { method: "DELETE" }),

  // --- Admin: subcategories
  adminSubcategories: (category?: string) =>
    request<SubcategoryApi[]>(
      `/admin/subcategories${category ? `?category=${encodeURIComponent(category)}` : ""}`,
    ),
  adminSubcategoryById: (id: string) =>
    request<SubcategoryApi>(`/admin/subcategories/${id}`),
  createSubcategory: (body: any) =>
    request<SubcategoryApi>("/admin/subcategories", { method: "POST", body }),
  updateSubcategory: (id: string, body: any) =>
    request<SubcategoryApi>(`/admin/subcategories/${id}`, { method: "PATCH", body }),
  deleteSubcategory: (id: string) =>
    request<{ deleted: boolean }>(`/admin/subcategories/${id}`, { method: "DELETE" }),

  // --- Admin: blogs
  adminBlogs: (query?: string) =>
    request<Paginated<BlogApi>>(`/admin/blogs${query ? `?${query}` : ""}`),
  adminBlogById: (id: string) => request<BlogApi>(`/admin/blogs/${id}`),
  createBlog: (body: any) =>
    request<BlogApi>("/admin/blogs", { method: "POST", body }),
  updateBlog: (id: string, body: any) =>
    request<BlogApi>(`/admin/blogs/${id}`, { method: "PATCH", body }),
  deleteBlog: (id: string) =>
    request<{ deleted: boolean }>(`/admin/blogs/${id}`, { method: "DELETE" }),

  // --- Admin: banners
  adminBanners: () => request<BannerApi[]>("/admin/banners"),
  adminBannerById: (id: string) => request<BannerApi>(`/admin/banners/${id}`),
  createBanner: (body: any) =>
    request<BannerApi>("/admin/banners", { method: "POST", body }),
  updateBanner: (id: string, body: any) =>
    request<BannerApi>(`/admin/banners/${id}`, { method: "PATCH", body }),
  deleteBanner: (id: string) =>
    request<{ deleted: boolean }>(`/admin/banners/${id}`, { method: "DELETE" }),

  // --- Admin: offers
  adminOffers: () => request<OfferApi[]>("/admin/offers"),
  adminOfferById: (id: string) => request<OfferApi>(`/admin/offers/${id}`),
  createOffer: (body: any) =>
    request<OfferApi>("/admin/offers", { method: "POST", body }),
  updateOffer: (id: string, body: any) =>
    request<OfferApi>(`/admin/offers/${id}`, { method: "PATCH", body }),
  deleteOffer: (id: string) =>
    request<{ deleted: boolean }>(`/admin/offers/${id}`, { method: "DELETE" }),

  // --- Admin: testimonials
  adminTestimonials: () => request<TestimonialApi[]>("/admin/testimonials"),
  adminTestimonialById: (id: string) =>
    request<TestimonialApi>(`/admin/testimonials/${id}`),
  createTestimonial: (body: any) =>
    request<TestimonialApi>("/admin/testimonials", { method: "POST", body }),
  updateTestimonial: (id: string, body: any) =>
    request<TestimonialApi>(`/admin/testimonials/${id}`, { method: "PATCH", body }),
  deleteTestimonial: (id: string) =>
    request<{ deleted: boolean }>(`/admin/testimonials/${id}`, { method: "DELETE" }),

  // --- Admin: faqs
  adminFaqs: () => request<FaqApi[]>("/admin/faqs"),
  adminFaqById: (id: string) => request<FaqApi>(`/admin/faqs/${id}`),
  createFaq: (body: any) => request<FaqApi>("/admin/faqs", { method: "POST", body }),
  updateFaq: (id: string, body: any) =>
    request<FaqApi>(`/admin/faqs/${id}`, { method: "PATCH", body }),
  deleteFaq: (id: string) =>
    request<{ deleted: boolean }>(`/admin/faqs/${id}`, { method: "DELETE" }),

  // --- Admin: orders
  adminOrders: (query?: string) =>
    request<Paginated<OrderApi>>(`/admin/orders${query ? `?${query}` : ""}`),
  adminOrderById: (id: string) => request<OrderApi>(`/admin/orders/${id}`),
  updateOrder: (id: string, body: any) =>
    request<OrderApi>(`/admin/orders/${id}`, { method: "PATCH", body }),
  deleteOrder: (id: string) =>
    request<{ deleted: boolean }>(`/admin/orders/${id}`, { method: "DELETE" }),

  // --- Admin: uploads
  uploadImages: async (
    files: File[],
    options: { onProgress?: (done: number, total: number) => void } = {},
  ): Promise<UploadedImage[]> => {
    if (files.length === 0) return [];

    let done = 0;
    return mapWithConcurrency(files, 3, async (file) => {
      const optimizedFile = await optimizeImageForUpload(file);
      const uploaded = await uploadPreparedImage(optimizedFile);
      done += 1;
      options.onProgress?.(done, files.length);
      return uploaded;
    });
  },

  uploadImage: async (file: File): Promise<UploadedImage> => {
    const optimizedFile = await optimizeImageForUpload(file);
    return uploadPreparedImage(optimizedFile);
  },
};

// ---------- Types ----------
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "user";
}

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; pages: number };
}

export interface ProductApi {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  images: string[];
  description: string;
  clothType: string;
  colors: string[];
  sizes: string[];
  stock: number;
  offerPrice: number;
  originalPrice: number;
  material: string;
  gsm?: string;
  pattern?: string;
  washable: boolean;
  featured: boolean;
  newArrival: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  specifications?: { label: string; value: string }[];
  retailEnabled?: boolean;
  wholesaleEnabled?: boolean;
  bundleSize?: number;
  allowMixedColors?: boolean;
  allowMixedSizes?: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkProductImportResult {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: { row: number; name?: string; message: string }[];
}

export interface CategoryApi {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  order: number;
  active: boolean;
}

export interface SubcategoryApi {
  id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
  productCount: number;
  order: number;
  active: boolean;
}

export interface BlogApi {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: string[];
  author: string;
  authorImage?: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  createdAt?: string;
}

export interface BannerApi {
  id: string;
  kind: "hero" | "opening_card";
  title: string;
  highlight?: string;
  subtitle?: string;
  eyebrow?: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  badge?: string;
  expiresAt?: string;
  order: number;
  active: boolean;
}

export interface OfferApi {
  id: string;
  title: string;
  description: string;
  code?: string;
  discountPercent: number;
  expiresAt: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
  active: boolean;
  order: number;
}

export interface TestimonialApi {
  _id: string;
  id?: string;
  name: string;
  role: string;
  company?: string;
  location: string;
  rating: number;
  review: string;
  image?: string;
  productPurchased?: string;
  approved: boolean;
  featured: boolean;
  order: number;
}

export type OrderStatus =
  | "new" | "contacted" | "quoted" | "confirmed"
  | "despatched" | "delivered" | "cancelled";

export type OrderSource =
  | "contact_form" | "product_enquiry" | "whatsapp" | "wholesale";

export interface OrderApi {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  productSlug?: string;
  productName?: string;
  color?: string;
  size?: string;
  quantity: number;
  message: string;
  source: OrderSource;
  status: OrderStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface SubmitOrderInput {
  customerName: string;
  phone: string;
  email?: string;
  productSlug?: string;
  productName?: string;
  color?: string;
  size?: string;
  quantity?: number;
  message: string;
  source?: OrderSource;
}

export interface FaqApi {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  order: number;
}

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface DashboardStats {
  products: { total: number; active: number; outOfStock: number };
  categories: { total: number };
  blogs: { total: number; published: number };
  orders: {
    total: number;
    new: number;
    last7Days: number;
    byStatus: Record<string, number>;
  };
  testimonials: { total: number };
  recentOrders: OrderApi[];
}

export interface VisitorCount {
  count: number;
}
