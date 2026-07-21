export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(str: string, n: number): string {
  return str.length > n ? `${str.slice(0, n - 1)}…` : str;
}

const FALLBACK_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=85";

export function blogImage(images: string[], index: number): string {
  return images[index] || images[0] || FALLBACK_BLOG_IMAGE;
}
