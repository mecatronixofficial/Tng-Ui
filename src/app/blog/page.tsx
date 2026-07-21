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
import { blogImage, cn } from "@/utils";

export const metadata: Metadata = {
  title: "Cloth Buying Guides",
  description: `Retail and wholesale cloth buying guides, fabric care notes and textile stock updates from ${siteConfig.name}.`,
};

export default async function BlogPage() {
  const blogPosts = await loadBlogs();
  const [first, ...rest] = blogPosts;
const banner = "/banners/different-types-of-cotton-fabric-every-indian-woman-should-know-1712779539443264_l.png";
  return (
    <>
      <PageHero
        eyebrow="Trade notes"
        title="Cloth buying guides for retail and wholesale customers."
        subtitle="Practical product notes, fabric care tips, stock updates and trade guidance from our textile team."
        bgImage={banner}
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
          {/* Full-bleed featured story */}
          {first && (
            <Link
              href={`/blog/${first.slug}`}
              className="group mb-16 block overflow-hidden rounded-lg shadow-warm"
            >
              <div className="relative aspect-[21/9] min-h-[320px] overflow-hidden bg-primary-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blogImage(first.images, 0)}
                  alt={first.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest-x text-white shadow-soft">
                      Featured guide
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest-x text-cream-100 ring-1 ring-inset ring-white/20">
                      {first.category}
                    </span>
                  </div>
                  <h1 className="display max-w-3xl text-3xl font-extrabold leading-[1.05] text-white md:text-5xl">
                    {first.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-cream-100/90 line-clamp-2 md:text-base">
                    {first.excerpt}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-cream-100/80">
                    <span>{moment(first.publishedAt).format("MMMM D, YYYY")}</span>
                    <span className="flex items-center gap-1">
                      <FaClock className="h-3 w-3 text-secondary-light" />
                      {first.readTime} min read
                    </span>
                    <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wide text-secondary-light transition group-hover:gap-3">
                      Read buying guide <FaArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <SectionTitle
            eyebrow="More articles"
            title="Recent cloth trade notes"
            action={
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
              >
                <FaWhatsapp className="h-4 w-4" />
                Ask product question
              </a>
            }
          />

          {/* Editorial masonry grid — every 5th story runs wide */}
          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((b, i) => {
              const wide = i % 5 === 0;
              return (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className={cn(
                    "group overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-secondary hover:shadow-warm",
                    wide && "md:col-span-2",
                  )}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden bg-primary-50",
                      wide ? "aspect-[21/9]" : "aspect-[4/3]",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blogImage(b.images, 0)}
                      alt={b.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-lg bg-secondary/90 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-white">
                      {b.category}
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
                      <span>{moment(b.publishedAt).format("MMM D, YYYY")}</span>
                      <span>·</span>
                      <span>{b.readTime} min read</span>
                    </div>
                    <h3
                      className={cn(
                        "display mt-3 font-extrabold leading-tight text-primary-950 transition group-hover:text-primary-700",
                        wide ? "text-2xl md:text-3xl" : "text-xl",
                      )}
                    >
                      {b.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 text-sm leading-6 text-ink-muted",
                        wide ? "line-clamp-2 max-w-2xl" : "line-clamp-2",
                      )}
                    >
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
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
