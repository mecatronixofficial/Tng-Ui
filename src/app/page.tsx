import Link from "next/link";
import moment from "moment";
import {
  FaArrowRight,
  FaWhatsapp,
  FaStore,
  FaBoxes,
  FaPhoneAlt,
  FaCheckCircle,
  FaQuoteLeft,
  FaQuestionCircle,
  FaClock,
} from "react-icons/fa";

import HeroSlider from "@/components/HeroSlider";
import SectionTitle from "@/components/SectionTitle";
import RichParagraphs from "@/components/RichParagraphs";
import CategorySlider from "@/components/CategorySlider";
import CollapsibleProductGrid from "@/components/CollapsibleProductGrid";
import TestimonialSlider from "@/components/TestimonialSlider";
import FAQAccordion from "@/components/FAQAccordion";
import OfferBanner from "@/components/OfferBanner";

import {
  loadCategories,
  loadProducts,
  loadBlogs,
  loadTestimonials,
  loadOffers,
  loadFaqs,
} from "@/lib/data";
import {
  siteConfig,
  manufacturingProcess,
} from "@/data/site";
import { blogImage } from "@/utils";



const buyerPaths = [
  {
    title: "Retail Cloth Shopping",
    text: "Buy single pieces, family-use cloths, daily wear and festival essentials.",
    href: "/products",
    action: "Shop retail",
    Icon: FaStore,
  },
  {
    title: "Wholesale Cloth Supply",
    text: "Get bulk supply for shops, traders, resellers, boutiques and institutions.",
    href: siteConfig.socials.whatsapp,
    action: "Send bulk enquiry",
    Icon: FaBoxes,
    external: true,
  },
] as const;

function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default async function HomePage() {
  const [categories, products, blogPosts, testimonials, offers, faqs] =
    await Promise.all([
      loadCategories(),
      loadProducts(),
      loadBlogs(),
      loadTestimonials(),
      loadOffers(),
      loadFaqs(),
    ]);

  const featured = shuffleItems(products.filter((p) => p.featured)).slice(0, 8);
  const newArrivals = shuffleItems(products.filter((p) => p.newArrival)).slice(
    0,
    8,
  );
  const wholesaleReady = shuffleItems(
    products.filter((p) => p.stock >= 100 || p.featured),
  ).slice(0, 8);
  const homeOfficeImages = [
    siteConfig.office.workplace1,
    siteConfig.office.workplace2,
    siteConfig.office.workplace3,
  ];
  const introImage = homeOfficeImages[0];

  return (
    <>
      <HeroSlider />

      {/* Categories */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionTitle
            eyebrow="Cloth Range"
            title="Search by Collections!"
            action={
              <div className="flex flex-wrap justify-end gap-3">
                <Link
                  href="/categories"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 px-5 py-3 text-sm font-bold text-primary-700 transition-colors duration-200 hover:border-primary-300 hover:text-primary-900"
                >
                  All Categories
                  <FaArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 px-5 py-3 text-sm font-bold text-primary-700 transition-colors duration-200 hover:border-primary-300 hover:text-primary-900"
                >
                  All Products
                  <FaArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 px-5 py-3 text-sm font-bold text-[#128C7E] transition-colors duration-200 hover:border-[#25D366]/50"
                >
                  <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
                  Wholesale
                </a>
              </div>
            }
          />

          <div className="rounded-2xl border border-neutral-200 p-3 md:p-6">
            <CategorySlider categories={categories} />
          </div>
        </div>
      </section>

      {/* Buyer paths */}
      <section className="relative overflow-hidden border-y border-primary-100 bg-white py-4 md:py-8">
        <div className="pointer-events-none absolute inset-0 bg-weave-light opacity-50" />
        <div className="container-x relative">
          <div className="mb-9 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-sm">
              <FaStore className="h-3 w-3 text-primary-500" />
              Shop your way
            </span>
            <h2 className="mt-3 font-display text-2xl font-black text-primary-950 sm:text-3xl">
              How would you like to buy?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-muted">
              Choose the option that best fits your textile needs.
            </p>
          </div>

          <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {buyerPaths.map(({ title, text, href, action, Icon, ...rest }) => {
              const external = "external" in rest ? rest.external : false;
              const isWholesale = external;
              const iconCls = isWholesale
                ? "bg-[#25D366]/10 text-[#128C7E]"
                : "bg-primary-50 text-primary-600";
              const badge = isWholesale ? "B2B · Bulk orders" : "B2C · Retail";

              const content = (
                <div className="flex h-full gap-4">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${iconCls}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary-400">
                      {badge}
                    </span>
                    <span className="block text-lg font-black text-ink">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-ink-muted">
                      {text}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-black uppercase tracking-wide text-primary-600">
                      {action}
                      <FaArrowRight className="h-2.5 w-2.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              );

              return external ? (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group h-full rounded-3xl border border-primary-100 bg-white p-6 shadow-[0_12px_35px_-24px_rgba(45,5,5,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-[0_18px_45px_-24px_rgba(45,5,5,0.45)]"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={title}
                  href={href}
                  className="group h-full rounded-3xl border border-primary-100 bg-white p-6 shadow-[0_12px_35px_-24px_rgba(45,5,5,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-[0_18px_45px_-24px_rgba(45,5,5,0.45)]"
                >
                  {content}
                </Link>
              );
            })}

            <div
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary-800 bg-primary-950 p-6 text-white shadow-[0_18px_45px_-24px_rgba(45,5,5,0.75)] transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 md:col-span-2 lg:col-span-1"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-secondary/15 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary-light transition-transform duration-300 group-hover:scale-105">
                  <FaPhoneAlt className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-white/50">
                    Call store directly
                  </span>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                    className="mt-1 block break-words text-lg font-black transition hover:text-secondary-light"
                  >
                    {siteConfig.phone}
                  </a>
                  <a
                    href={`tel:${siteConfig.secondaryPhone.replace(/\D/g, "")}`}
                    className="mt-1 block break-words text-sm font-bold text-white/70 transition hover:text-secondary-light"
                  >
                    {siteConfig.secondaryPhone}
                  </a>
                </div>
              </div>
              <div className="relative mt-auto pt-5">
                <div className="border-t border-white/10 pt-4 text-xs leading-5 text-white/60">
                  {siteConfig.workingHours}
                </div>
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-secondary-light">
                  Choose a number
                  <FaArrowRight className="h-2.5 w-2.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer */}
      {offers.length > 1 && (
        <section className="bg-gradient-to-b from-white to-primary-50/60 py-12">
          <div className="container-x">
            <OfferBanner offer={offers[1]} />
          </div>
        </section>
      )}

      {/* Retail arrivals */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionTitle
            eyebrow="Retail Picks"
            title="New arrivals for everyday use"
            action={
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300 hover:text-primary-900"
              >
                Shop New Arrivals <FaArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <CollapsibleProductGrid
            products={newArrivals.length > 0 ? newArrivals : featured}
          />
        </div>
      </section>

      {/* Intro / stats */}
      <section className="relative overflow-hidden bg-rose-50 py-8 md:py-12 lg:py-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-rose-300/30 blur-3xl" />
        <div className="container-x relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
            {/* CONTENT */}
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-700 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Est. {siteConfig.established} · {siteConfig.address.city}, Tamil Nadu
              </span>

              <h2 className="mt-5 font-display text-2xl font-black leading-tight tracking-[-0.02em] text-primary-950 md:text-3xl lg:text-4xl">
                {siteConfig.tagline}
              </h2>

              <RichParagraphs
                text={siteConfig.description}
                className="mt-4 max-w-xl"
                paragraphClassName="text-sm leading-6 text-ink-muted md:text-base md:leading-7"
              />

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                {[
                  "Inskirt, Nighty, Lungi, Ayyappan Bags",
                  "Dhotis & Towels",
                  `GST since ${siteConfig.gstSince}`,
                  "Pan-India dispatch",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 text-sm font-semibold text-ink"
                  >
                    <FaCheckCircle className="h-3 w-3 shrink-0 text-rose-500" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rose-600 px-6 text-sm font-black text-white shadow-[0_16px_40px_-20px_rgba(225,29,72,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700"
                >
                  Browse Cloth Range
                  <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-6 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-[#25D366]/50 hover:text-[#128C7E]"
                >
                  <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
                  Wholesale Enquiry
                </a>
              </div>
            </div>

            {/* IMAGE */}
            <div className="relative mx-auto w-56 sm:w-64 lg:col-span-4 lg:ml-auto lg:mr-0 lg:w-80">
              <div className="absolute -right-4 -top-4 h-full w-full rounded-2xl border-2 border-rose-400/50" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white bg-white p-1.5 shadow-[0_25px_60px_-25px_rgba(225,29,72,0.45)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={introImage}
                  alt={`${siteConfig.name} textile products`}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer */}
      {offers.length > 0 && (
        <section className="bg-gradient-to-b from-white to-primary-50/60 py-12">
          <div className="container-x">
            <OfferBanner offer={offers[0]} />
          </div>
        </section>
      )}

      {/* Wholesale-ready products */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionTitle
            eyebrow="Wholesale Ready"
            title="Fast-moving cloths for shops"
            action={
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300 hover:text-primary-900"
              >
                View All Products <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />

          <CollapsibleProductGrid products={wholesaleReady} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden section-y bg-gradient-to-b from-primary-50/70 to-white">
        <FaQuoteLeft className="pointer-events-none absolute -left-6 top-10 hidden h-40 w-40 text-primary-100/60 lg:block" />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="Buyer Proof"
              title="Customers who come back"
            />
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">
              Real feedback from retail buyers and wholesale partners we
              serve across Tamil Nadu.
            </p>
            <Link
              href="/testimonials"
              className="btn-outline mt-6 rounded-xl bg-white shadow-soft"
            >
              All Reviews <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <TestimonialSlider items={testimonials.slice(0, 4)} />
          </div>
        </div>
      </section>

      {/* Manufacturing process */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionTitle
                eyebrow="From yarn to packing"
                title="How our cloth is prepared"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-primary-100 bg-primary-50 lg:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={homeOfficeImages[2]}
                alt={`${siteConfig.name} packing and despatch area`}
                className="h-[220px] w-full object-cover md:h-[260px]"
              />
            </div>
          </div>
          <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            <div className="pointer-events-none absolute left-0 right-0 top-8 hidden border-t-2 border-dashed border-primary-200 lg:block" />
            {manufacturingProcess.map((p, i) => (
              <div key={p.step} className="group relative">
                <div className="relative flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-5 shadow-[0_12px_35px_-28px_rgba(45,5,5,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-300 hover:shadow-[0_18px_45px_-24px_rgba(45,5,5,0.35)]">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-sm font-black text-white shadow-[0_10px_25px_-12px_rgba(45,5,5,0.6)] transition-transform duration-300 group-hover:scale-110">
                      {p.step}
                    </span>
                    {i < manufacturingProcess.length - 1 && (
                      <FaArrowRight className="hidden h-3.5 w-3.5 text-primary-200 lg:block" />
                    )}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {p.description}
                  </p>
                  <span className="mt-auto pt-4 text-[10px] font-black uppercase tracking-widest text-primary-300 transition-colors group-hover:text-primary-500">
                    Step {p.step}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog / trade notes */}
      {blogPosts.length > 0 && (
        <section className="section-y bg-primary-50/40">
          <div className="container-x">
            <SectionTitle
              eyebrow="Trade Notes"
              title="Cloth buying guides & updates"
              action={
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300 hover:text-primary-900"
                >
                  All Articles <FaArrowRight className="h-3 w-3" />
                </Link>
              }
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-[0_12px_35px_-28px_rgba(45,5,5,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-primary-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blogImage(post.images, 0)}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-lg bg-primary-950/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
                      <span>{moment(post.publishedAt).format("MMM D, YYYY")}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <FaClock className="h-3 w-3" />
                        {post.readTime} min read
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-black leading-snug text-ink transition-colors group-hover:text-primary-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="section-y bg-white">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-sm">
                  <FaQuestionCircle className="h-3 w-3 text-primary-500" />
                  Buyer help
                </span>
                <h2 className="mt-3 font-display text-2xl font-black text-primary-950 sm:text-3xl">
                  Common questions before you order
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">
                  Quick answers on cloth categories, bulk orders and delivery.
                </p>
                <Link
                  href="/faq"
                  className="btn-outline mt-6 rounded-xl bg-white shadow-soft"
                >
                  View All FAQs <FaArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="lg:col-span-8">
                <FAQAccordion items={faqs.slice(0, 6)} />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
