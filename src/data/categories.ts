import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "c1",
    name: "Petticoats",
    slug: "petticoats",
    description:
      "Soft cotton petticoats, inskirts and underskirts crafted for daily comfort and lasting wear.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80",
    productCount: 3,
  },
  {
    id: "c2",
    name: "Lungis",
    slug: "lungis",
    description:
      "Traditional cotton and handloom lungis in solid colours, checks and authentic Erode weaves.",
    image:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1200&auto=format&fit=crop&q=80",
    productCount: 5,
  },
  {
    id: "c3",
    name: "Towels",
    slug: "towels",
    description:
      "Highly absorbent cotton bath towels — soft on skin, built to last wash after wash.",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&auto=format&fit=crop&q=80",
    productCount: 2,
  },
  {
    id: "c4",
    name: "Gamcha",
    slug: "gamcha",
    description:
      "Lightweight, quick-drying cotton gamcha and gumcha — a south Indian everyday essential.",
    image:
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=1200&auto=format&fit=crop&q=80",
    productCount: 3,
  },
  {
    id: "c5",
    name: "Bed Sheets",
    slug: "bed-sheets",
    description:
      "Pure cotton bed sheets in single, double and king sizes — soft hand-feel, fast colours.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80",
    productCount: 2,
  },
  {
    id: "c6",
    name: "Handloom",
    slug: "handloom",
    description:
      "Heritage handloom range woven by skilled weavers across the Erode-Karur belt.",
    image:
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=1200&auto=format&fit=crop&q=80",
    productCount: 2,
  },
  {
    id: "c7",
    name: "Dhoti",
    slug: "dhoti",
    description:
      "Classic white and bordered cotton dhotis for daily wear, weddings and temple visits.",
    image:
      "https://images.unsplash.com/photo-1622043720586-04b9eba47b8d?w=1200&auto=format&fit=crop&q=80",
    productCount: 2,
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
