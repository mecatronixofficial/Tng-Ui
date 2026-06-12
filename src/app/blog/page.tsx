import type { Metadata } from "next";
import Link from "next/link";
import moment from "moment";
import {
  FaArrowRight,
  FaBoxes,
  FaClock,
  FaStore,
  FaTags,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import { siteConfig } from "@/data/site";
import { loadBlogs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cloth Buying Guides",
  description: `Retail and wholesale cloth buying guides, fabric care notes and textile stock updates from ${siteConfig.name}.`,
};

export default async function BlogPage() {
  const blogPosts = await loadBlogs();
  const [first, ...rest] = blogPosts;

  return (
    <>
      <PageHero
        eyebrow="Trade notes"
        title="Cloth buying guides for retail and wholesale customers."
        subtitle="Practical product notes, fabric care tips, stock updates and trade guidance from our textile team."
        bgImage="https://images.unsplash.com/photo-1620713043691-2a6c2c5dd47f?w=1920&auto=format&fit=crop&q=80"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <section className="border-b border-primary-100 bg-white">
        <div className="container-x grid gap-3 py-6 md:grid-cols-3">
          {[
            { label: "Retail cloth care", Icon: FaStore },
            { label: "Wholesale buying tips", Icon: FaBoxes },
            { label: "Product and stock notes", Icon: FaTags },
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
          {first && (
            <Link
              href={`/blog/${first.slug}`}
              className="group mb-16 block overflow-hidden rounded-lg border border-primary-100 bg-white shadow-warm"
            >
              <div className="grid lg:grid-cols-12">
                <div className="relative min-h-[320px] overflow-hidden bg-primary-50 lg:col-span-7">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={first.coverImage}
                    alt={first.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-5 top-5 rounded-lg bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-white shadow-soft">
                    Featured guide
                  </div>
                </div>
                <div className="p-6 lg:col-span-5 lg:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-800">
                      <FaStore className="h-3 w-3 text-secondary" />
                      Retail
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary-dark">
                      <FaBoxes className="h-3 w-3" />
                      Wholesale
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-muted">
                    <span>{moment(first.publishedAt).format("MMMM D, YYYY")}</span>
                    <span className="flex items-center gap-1">
                      <FaClock className="h-3 w-3 text-secondary" />
                      {first.readTime} min read
                    </span>
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold leading-tight text-primary-950 transition group-hover:text-primary-700 md:text-4xl">
                    {first.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-ink-muted">
                    {first.excerpt}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-secondary transition group-hover:gap-3">
                    Read buying guide <FaArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              eyebrow="More articles"
              title="Recent cloth trade notes"
              description="Short, useful reads for product selection, care, wholesale planning and repeat stock decisions."
            />
            <a
              href={siteConfig.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
            >
              <FaWhatsapp className="h-4 w-4" />
              Ask product question
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="group overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-secondary hover:shadow-warm"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-primary-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-lg bg-secondary/90 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-white">
                    {b.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
                    <span>{moment(b.publishedAt).format("MMM D, YYYY")}</span>
                    <span>·</span>
                    <span>{b.readTime} min read</span>
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold leading-tight text-primary-950 transition group-hover:text-primary-700">
                    {b.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">
                    {b.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-primary-100 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                      Cloth guide
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
                      Read <FaArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
