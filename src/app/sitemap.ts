import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { loadCategories, loadBlogs } from "@/lib/data";

const BASE = "https://www.jai-india.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, blogPosts] = await Promise.all([loadCategories(), loadBlogs()]);

  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/categories",
    "/blog",
    "/testimonials",
    "/contact",
    "/faq",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((b) => ({
    url: `${BASE}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
