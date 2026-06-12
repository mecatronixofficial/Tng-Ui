import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import moment from "moment";
import {
  FaArrowLeft,
  FaBoxes,
  FaClock,
  FaFacebookF,
  FaStore,
  FaTags,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import { siteConfig } from "@/data/site";
import { loadBlogs, loadBlogBySlug } from "@/lib/data";

export async function generateStaticParams() {
  const blogs = await loadBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadBlogBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadBlogBySlug(slug);
  if (!post) notFound();

  const all = await loadBlogs();
  const related = all.filter((b) => b.slug !== slug).slice(0, 3);
  const shareText = encodeURIComponent(`${post.title} - ${siteConfig.name}`);

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        subtitle={post.excerpt}
        bgImage={post.coverImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="section-y bg-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-5">
              <div className="rounded-lg border border-primary-100 bg-white p-5 shadow-soft">
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                  <FaTags className="h-3 w-3 text-secondary" />
                  Article details
                </div>
                <div className="flex items-center gap-3 border-t border-primary-100 pt-4">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-sm font-extrabold text-white">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-ink">
                      {post.author}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider-x text-ink-muted">
                      {moment(post.publishedAt).format("MMM D, YYYY")}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-800">
                    <FaClock className="h-3.5 w-3.5 text-secondary" />
                    {post.readTime} min read
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 text-xs font-bold text-primary-800">
                    <FaStore className="h-3.5 w-3.5 text-secondary" />
                    Retail guide
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 text-xs font-bold text-primary-800">
                    <FaBoxes className="h-3.5 w-3.5 text-secondary" />
                    Wholesale insight
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-secondary/30 bg-white p-5 shadow-soft">
                <div className="text-[10px] font-bold uppercase tracking-widest-x text-secondary">
                  Need cloth details?
                </div>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Message us for retail products or wholesale stock availability.
                </p>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary-dark"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft">
              <div className="border-b border-primary-100 p-5 md:p-7">
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
                <p className="text-lg font-semibold leading-8 text-ink-soft">
                  {post.excerpt}
                </p>
              </div>

              <div className="p-5 md:p-7">
                {post.content.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="mb-7 text-lg leading-8 text-ink-soft last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div className="border-t border-primary-100 bg-primary-50 p-5 md:p-7">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                    Tags
                  </span>
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-ink-soft shadow-soft"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                    Share
                  </span>
                  {[
                    {
                      Icon: FaWhatsapp,
                      label: "WhatsApp",
                      href: `https://wa.me/?text=${shareText}`,
                    },
                    {
                      Icon: FaFacebookF,
                      label: "Facebook",
                      href: "https://facebook.com",
                    },
                    { Icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
                  ].map(({ Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-10 w-10 place-items-center rounded-lg border border-primary-100 bg-white text-primary-800 transition hover:border-secondary hover:bg-secondary hover:text-white"
                      aria-label={label}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-y bg-white">
          <div className="container-x">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-secondary/30 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800 shadow-soft">
                  <FaTags className="h-3 w-3 text-secondary" />
                  Continue reading
                </div>
                <h2 className="text-3xl font-extrabold text-primary-950 md:text-4xl">
                  More cloth trade notes
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider-x text-primary-800 hover:text-secondary"
              >
                <FaArrowLeft className="h-3 w-3" /> All articles
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {related.map((b) => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="group overflow-hidden rounded-lg border border-primary-100 bg-cream-50 shadow-soft transition hover:border-secondary hover:bg-white hover:shadow-warm"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-extrabold leading-tight text-primary-950 transition group-hover:text-primary-700">
                      {b.title}
                    </h3>
                    <div className="mt-3 text-xs font-semibold text-ink-muted">
                      {moment(b.publishedAt).format("MMM D, YYYY")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
