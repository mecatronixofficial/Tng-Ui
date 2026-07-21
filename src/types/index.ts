export interface Product {
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
  bundleSize?: number; // pieces per wholesale bundle (default 12)
  allowMixedColors?: boolean;
  allowMixedSizes?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
  productCount: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  badge?: string;
  itemCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: string[];
  author: string;
  authorImage?: string;
  publishedAt: string; // ISO
  category: string;
  tags: string[];
  readTime: number; // minutes
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  location: string;
  rating: number;
  review: string;
  image?: string;
  productPurchased?: string;
  featured?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code?: string;
  discountPercent: number;
  expiresAt: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  active?: boolean;
  order?: number;
}

export interface OpeningCardData {
  enabled: boolean;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  expiresAt?: string;
  badge?: string;
}
