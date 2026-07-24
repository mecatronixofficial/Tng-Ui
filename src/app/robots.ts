import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/cart", "/wishlist"],
    },
    sitemap: "https://www.thangaveltextile.com/sitemap.xml",
    host: "https://www.thangaveltextile.com",
  };
}
