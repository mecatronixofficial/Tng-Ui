import Link from "next/link";
import moment from "moment";
import {
  FaArrowRight,
  FaWhatsapp,
  FaStore,
  FaIndustry,
  FaMapMarkerAlt,
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



const locations = [
  {
    title: siteConfig.name,
    subtitle: "Wholesale & Retail Showroom",
    image: siteConfig.office.workplace1,
    address: `${siteConfig.address.line2}, ${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.pincode}`,
    mapLink: siteConfig.locationMapLink,
    phone: siteConfig.phone,
    Icon: FaStore,
  },
  {
    title: "Manufacturing Unit",
    subtitle: "Production & Quality Control",
    image: siteConfig.office.workplace2,
    address: siteConfig.manufacturingAddress,
    mapLink: siteConfig.manufacturingMapLink,
    phone: siteConfig.secondaryPhone,
    Icon: FaIndustry,
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


          <CategorySlider categories={categories} />

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
      <section className="relative overflow-hidden bg-[#6f1325] py-8 md:py-12 lg:py-16">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-secondary/8 blur-[130px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-primary-600/20 blur-[130px]" />
        <div className="pointer-events-none absolute inset-0 bg-weave-dark opacity-40" />
        <div className="container-x relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">

            {/* CONTENT */}
            <div className="lg:col-span-8">

              {/* Location Badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D8B06A]/50 bg-[#FFF8E7] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#6B1A2A] shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8B1E3F]" />
                Est. {siteConfig.established} · {siteConfig.address.city}, Tamil Nadu
              </span>

              {/* Heading */}
              <h2 className="mt-5 font-display text-2xl font-black leading-tight tracking-[-0.02em] text-white md:text-3xl lg:text-4xl">
                {siteConfig.tagline}
              </h2>

              {/* Description */}
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#F5E6D3] md:text-base md:leading-7">
                {siteConfig.description}
              </p>

              {/* Features */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                {[
                  "Inskirt, Nighty, Lungi, Ayyappan Bags",
                  "Dhotis & Towels",
                  `GST since ${siteConfig.gstSince}`,
                  "Pan-India dispatch",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 text-sm font-semibold text-[#FFF8E7]"
                  >
                    <FaCheckCircle className="h-3.5 w-3.5 shrink-0 text-[#D8B06A]" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                {/* Primary Button */}
                <Link
                  href="/products"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFF8E7] px-6 text-sm font-black text-[#4A0E1A] shadow-[0_16px_40px_-20px_rgba(216,176,106,0.8)] transition-all hover:-translate-y-0.5 hover:bg-[#E5C27D]"
                >
                  Browse Cloth Range
                  <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* WhatsApp Button */}
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#F5E6D3]/40 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[#25D366]/60 hover:bg-white hover:text-[#128C7E]"
                >
                  <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
                  Wholesale Enquiry
                </a>

              </div>
            </div>

            {/* IMAGE */}
            <div className="relative mx-auto w-56 sm:w-64 lg:col-span-4 lg:ml-auto lg:mr-0 lg:w-80">

              {/* Decorative Border */}
              <div className="absolute -right-4 -top-4 h-full w-full rounded-2xl border-2 border-[#D8B06A]/60" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#F5E6D3] bg-[#FFF8E7] p-1.5 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.6)]">
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
                description="Every roll begins as raw yarn and moves through carding, weaving, dyeing and finishing under close quality checks. Each batch is inspected by hand for weave, colour and strength before it leaves the floor. Only then is it folded, labelled and packed for despatch."
              />
            </div>
            <div className="group relative lg:col-span-5">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-secondary/40 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4" />
              <div className="relative overflow-hidden rounded-2xl shadow-lg ring-4 ring-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={homeOfficeImages[2]}
                  alt={`${siteConfig.name} packing and despatch area`}
                  className="h-[220px] w-full object-cover transition duration-700 group-hover:scale-105 md:h-[260px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>
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

      {/* Locations */}
      <section className="py-2 md:py-4">
        <div className="container-x">
          <SectionTitle
            eyebrow=" Visit us"
            title="How our cloth is prepared"
            description=" Walk in, call, or get directions to either of our locations in Erode."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {locations.map(({ title, subtitle, image, address, mapLink, phone, Icon }) => (
              <div
                key={title}
                className="group flex flex-col bg-white transition-all duration-300 sm:flex-row"
              >
                <div className="relative m-4 h-40 w-30 shrink-0 sm:h-auto sm:w-40 md:w-48">
                  <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-xl bg-secondary/40 transition-transform duration-300 group-hover:translate-x-3.5 group-hover:translate-y-3.5" />
                  <div className="absolute inset-0 overflow-hidden rounded-xl shadow-lg ring-4 ring-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary-500">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {subtitle}
                  </div>

                  <h3 className="font-display text-xl font-black text-ink sm:text-2xl">{title}</h3>

                  <div className="flex flex-col gap-2.5 text-sm text-ink-muted">
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start gap-2 leading-6 transition hover:text-primary-700"
                    >
                      <FaMapMarkerAlt className="mt-1 h-3.5 w-3.5 shrink-0 text-primary-400" />
                      {address}
                    </a>
                    <a
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="flex items-center gap-2 font-bold text-primary-700 transition hover:text-primary-900"
                    >
                      <FaPhoneAlt className="h-3 w-3 text-primary-400" />
                      {phone}
                    </a>
                  </div>

                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-primary-900 px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition group-hover:bg-secondary"
                  >
                    Get directions
                    <FaArrowRight className="h-2.5 w-2.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
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

    </>
  );
}
