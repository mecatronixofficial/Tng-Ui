import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import {
  FaArrowRight,
  FaBoxes,
  FaClock,
  FaFacebookF,
  FaTags,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/data/site";
import { loadBlogs, loadBlogBySlug } from "@/lib/data";
import { blogImage } from "@/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadBlogBySlug(slug);
  if (!post) {
    return { title: "Article Not Found", robots: { index: false, follow: false } };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, ...post.tags, "textile blog", siteConfig.name],
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: blogImage(post.images, 0), alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [blogImage(post.images, 0)],
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
  const related = all.filter((blog) => blog.slug !== slug).slice(0, 3);
  const shareText = encodeURIComponent(`${post.title} - ${siteConfig.name}`);
  const paragraphs = post.content.split("\n\n").filter(Boolean);
  const chunkSize = Math.max(1, Math.ceil(paragraphs.length / 3));
  const paragraphChunks = [
    paragraphs.slice(0, chunkSize),
    paragraphs.slice(chunkSize, chunkSize * 2),
    paragraphs.slice(chunkSize * 2),
  ];
  let paraKey = 0;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.images.map((img) => blogImage([img], 0)),
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: "https://www.thangaveltextile.com/logo/tng%20logo.jpeg" },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: `https://www.thangaveltextile.com/blog/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.thangaveltextile.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.thangaveltextile.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.thangaveltextile.com/blog/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Minimal text hero — article cover photo behind a light scrim, dark text stays readable */}
      <section className="relative overflow-hidden border-b border-primary-100 bg-primary-100">
        <Image
          src={blogImage(post.images, 0)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/95 via-primary-50/85 to-primary-50/50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="relative container-x py-8 md:py-12">
          <div className="mb-5">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest-x text-white shadow-soft">
              {post.category}
            </span>
            <h1 className="display mt-4 text-3xl font-extrabold leading-[1.05] text-primary-950 md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-muted">
              <span className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-950 font-display text-sm font-bold text-white">
                  {post.author?.charAt(0) ?? "T"}
                </span>
                {post.author}
              </span>
              <span>{moment(post.publishedAt).format("MMMM D, YYYY")}</span>
              <span className="flex items-center gap-1.5">
                <FaClock className="h-3 w-3 text-secondary" /> {post.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      <article className="bg-cream-50 pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            {/* Main column */}
            <div>
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-soft">
                <div className="relative aspect-[16/8] w-full">
                  <Image
                    src={blogImage(post.images, 0)}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 800px, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6 md:p-10">
                  {/* Pull-quote excerpt */}
                  <p className="relative mt-8 max-w-2xl pl-6 font-display text-xl italic leading-relaxed text-primary-900 first:mt-0 md:text-2xl">
                    <span className="absolute -left-1 -top-2 font-display text-5xl text-secondary/40">&ldquo;</span>
                    {post.excerpt}
                  </p>

                  {/* Body */}
                  <div className="prose-content mt-8 max-w-2xl space-y-6 text-base leading-8 text-ink-soft md:text-[1.05rem]">
                    {paragraphChunks[0].map((para, i) => (
                      <p key={paraKey++} className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:font-bold first-letter:text-primary-950" : ""}>
                        {para}
                      </p>
                    ))}
                  </div>

                  {paragraphChunks[1].length > 0 && (
                    <>
                      <figure className="relative my-8 aspect-[16/8] w-full overflow-hidden rounded-2xl">
                        <Image
                          src={blogImage(post.images, 2)}
                          alt={`${post.title} — in the middle of the article`}
                          fill
                          sizes="(min-width: 1024px) 672px, 100vw"
                          className="object-cover"
                        />
                      </figure>
                      <div className="max-w-2xl space-y-6 text-base leading-8 text-ink-soft md:text-[1.05rem]">
                        {paragraphChunks[1].map((para) => (
                          <p key={paraKey++}>{para}</p>
                        ))}
                      </div>
                    </>
                  )}

                  {paragraphChunks[2].length > 0 && (
                    <div className="my-8 flex max-w-2xl gap-4 rounded-2xl bg-cream-100 p-6">
                      <FaBoxes className="mt-1 h-5 w-5 shrink-0 text-secondary" />
                      <div className="space-y-6 text-base leading-8 text-ink-soft md:text-[1.05rem]">
                        {paragraphChunks[2].map((para) => (
                          <p key={paraKey++}>{para}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags + share */}
                  <div className="mt-10 flex max-w-2xl flex-col gap-6 border-t border-primary-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <FaTags className="h-3.5 w-3.5 text-ink-muted" />
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-cream-100 px-3 py-1.5 text-xs font-semibold text-primary-800">#{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5">
                      {[
                        { Icon: FaWhatsapp, label: "WhatsApp", href: `https://wa.me/?text=${shareText}` },
                        { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
                        { Icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
                      ].map(({ Icon, label, href }) => (
                        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full bg-cream-100 text-primary-800 transition hover:bg-primary-950 hover:text-white">
                          <Icon className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA banner — mobile / tablet only, sidebar covers desktop */}
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-primary-950 p-6 text-white shadow-soft transition hover:bg-primary-900 md:p-8 lg:hidden"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary/20">
                    <FaWhatsapp className="h-5 w-5 text-secondary-light" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold md:text-xl">Looking for this fabric?</span>
                    <span className="mt-0.5 block text-xs text-cream-100/70 md:text-sm">Ask us about retail pieces &amp; wholesale availability</span>
                  </span>
                </span>
                <FaArrowRight className="h-4 w-4 shrink-0 text-secondary-light" />
              </a>
            </div>

            {/* Sidebar — desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-950 font-display text-lg font-bold text-white">
                      {post.author?.charAt(0) ?? "T"}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-primary-950">{post.author}</span>
                      <span className="text-xs text-ink-muted">{moment(post.publishedAt).format("MMMM D, YYYY")}</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-2 rounded-full bg-cream-100 px-3 py-2 text-xs font-semibold text-primary-800">
                    <FaClock className="h-3 w-3 text-secondary" /> {post.readTime} min read
                  </div>
                </div>

                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl bg-primary-950 p-6 text-white shadow-soft transition hover:bg-primary-900"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary/20">
                    <FaWhatsapp className="h-5 w-5 text-secondary-light" />
                  </span>
                  <span className="mt-5 block font-display text-lg font-bold leading-tight">Looking for this fabric?</span>
                  <span className="mt-2 block text-xs leading-relaxed text-cream-100/70">Ask us about retail pieces &amp; wholesale availability</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider-x text-secondary-light">
                    Chat now <FaArrowRight className="h-3 w-3" />
                  </span>
                </a>

                <div className="rounded-2xl bg-white p-6 shadow-soft">
                  <span className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-ink-muted">
                    <FaTags className="h-3 w-3" /> Filed under
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-cream-100 px-3 py-1.5 text-xs font-semibold text-primary-800">#{tag}</span>
                    ))}
                  </div>
                  <span className="mb-3 mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-ink-muted">Share</span>
                  <div className="flex items-center gap-2.5">
                    {[
                      { Icon: FaWhatsapp, label: "WhatsApp", href: `https://wa.me/?text=${shareText}` },
                      { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
                      { Icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
                    ].map(({ Icon, label, href }) => (
                      <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full bg-cream-100 text-primary-800 transition hover:bg-primary-950 hover:text-white">
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-cream-100 py-16 md:py-24">
          <div className="container-x">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest-x text-secondary">From the journal</span>
                <h2 className="mt-3 font-display text-3xl font-bold text-primary-950 md:text-4xl">Continue exploring</h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider-x text-primary-800 transition hover:text-secondary">
                All articles <FaArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={blogImage(blog.images, 0)}
                      alt={blog.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest-x text-secondary">{blog.category}</span>
                    <h3 className="mt-2 font-display text-lg font-bold leading-tight text-primary-950 group-hover:text-primary-700">{blog.title}</h3>
                    <div className="mt-3 text-xs font-semibold text-ink-muted">{moment(blog.publishedAt).format("MMMM D, YYYY")}</div>
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
