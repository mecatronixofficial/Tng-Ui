import type { Metadata } from "next";
import Link from "next/link";
import {
  FaArrowRight,
  FaBoxes,
  FaCheckCircle,
  FaFileInvoice,
  FaHandshake,
  FaQuoteRight,
  FaStore,
  FaTags,
  FaTruckMoving,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import StatsCounter from "@/components/StatsCounter";
import { categories } from "@/data/categories";
import { siteConfig, stats } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} — a retail and wholesale cloth supplier from ${siteConfig.address.city}, ${siteConfig.address.state}, serving cotton and handloom textile buyers since ${siteConfig.established}.`,
};

const buyerPaths = [
  {
    title: "Retail Cloth Buyers",
    text: "Daily wear, home-use cloths, family shopping and festival essentials.",
    Icon: FaStore,
  },
  {
    title: "Wholesale Cloth Buyers",
    text: "Bulk supply for shops, traders, boutiques, resellers and institutions.",
    Icon: FaBoxes,
  },
  {
    title: "Reliable Despatch",
    text: "Practical packing, clear communication and transport support across India.",
    Icon: FaTruckMoving,
  },
];

const promises = [
  "Retail and wholesale orders handled with the same care",
  "Focused range: petticoats, lungis, towels, gamcha, bed sheets, dhotis and handloom",
  "Clear product details before billing or despatch",
  "GST-ready invoicing for trade buyers",
  "WhatsApp support for fast quotes and repeat orders",
  "Practical supply for everyday cloth demand",
];

const tradeFlow = [
  "Choose cloth category and quantity",
  "Share colour, size, packing and city details",
  "Get availability confirmation",
  "Confirm order and despatch preference",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the store"
        title="Retail and wholesale cloth supply from Erode."
        subtitle={`${siteConfig.name} serves families, shop owners and textile traders with practical cotton and handloom products since ${siteConfig.established}.`}
        bgImage="https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=1920&auto=format&fit=crop&q=80"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Buyer profile */}
      <section className="section-y bg-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-lg border border-primary-100 bg-white shadow-warm">
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=85"
                  alt="Cotton cloth retail and wholesale"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute left-5 top-5 rounded-lg bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-white shadow-soft">
                Retail + Wholesale
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-primary-900/95 p-4 text-white shadow-soft">
                <div className="text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
                  {siteConfig.address.city}, {siteConfig.address.state}
                </div>
                <div className="mt-1 text-xl font-extrabold">
                  Cloths for homes, shops and traders.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SectionTitle
              eyebrow="Who we serve"
              title="A cloth business built for both walk-in needs and bulk trade."
              description={`${siteConfig.name} is a ${siteConfig.legalStatus.toLowerCase()} textile business from ${siteConfig.address.city}. We supply everyday cloth products for retail customers and wholesale buyers who need dependable stock, repeat availability and clear communication.`}
            />

            <div className="grid gap-4 md:grid-cols-3">
              {buyerPaths.map(({ title, text, Icon }) => (
                <div
                  key={title}
                  className="rounded-lg border border-primary-100 bg-white p-5 shadow-soft"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-600 text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-primary-950">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary"
              >
                View Cloth Range <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-secondary/30 bg-white px-6 py-3 text-sm font-bold text-secondary transition hover:bg-secondary hover:text-white"
              >
                <FaWhatsapp className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-primary-100 bg-white py-12">
        <div className="container-x">
          <StatsCounter items={stats} />
        </div>
      </section>

      {/* Product range */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              eyebrow="Our cloth range"
              title="Focused categories for retail shelves and wholesale stock."
              description="We keep the range practical, familiar and easy to reorder for everyday textile demand."
            />
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider-x text-primary-800 hover:text-secondary"
            >
              View categories <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group rounded-lg border border-primary-100 bg-primary-50 p-4 transition hover:border-secondary hover:bg-white hover:shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-lg bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-primary-950">
                      {category.name}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-widest-x text-secondary">
                      {category.productCount} items
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="section-y bg-primary-950 text-white">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="What we promise"
              title="Trade-friendly service without confusion."
              description="Whether the order is small or bulk, our focus stays on practical product quality and clear communication."
              light
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {promises.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/6 p-4"
              >
                <FaCheckCircle className="mt-1 h-4 w-4 shrink-0 text-secondary-light" />
                <span className="text-sm font-semibold leading-6 text-white/80">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder and flow */}
      <section className="section-y bg-cream-50">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-lg border border-secondary/30 bg-white p-7 shadow-warm md:p-10">
              <FaQuoteRight className="absolute right-6 top-6 h-16 w-16 text-secondary/10" />
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                <FaHandshake className="h-3 w-3 text-secondary" />
                From the founder
              </div>
              <blockquote className="relative text-2xl font-extrabold leading-snug text-primary-950 md:text-3xl">
                &ldquo;We believe cloth buying should be simple. Retail customers
                need dependable everyday products, and wholesale buyers need
                clear details, repeat stock and honest despatch timelines.&rdquo;
              </blockquote>
              <div className="mt-6 border-t border-primary-100 pt-5">
                <div className="font-extrabold text-ink">{siteConfig.ceo}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-widest-x text-secondary">
                  Founder, {siteConfig.name}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-lg border border-primary-100 bg-white p-7 shadow-soft md:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                <FaTruckMoving className="h-3 w-3 text-secondary" />
                Wholesale flow
              </div>
              <div className="space-y-4">
                {tradeFlow.map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-extrabold text-white">
                      {index + 1}
                    </span>
                    <div className="rounded-lg bg-primary-50 px-4 py-3 text-sm font-bold leading-6 text-primary-950">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business info */}
      <section className="section-y bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="Business information"
              title="On record and ready for trade."
              description="Useful details for retail customers, wholesale buyers and repeat business partners."
            />
          </div>
          <div className="lg:col-span-8">
            <dl className="grid overflow-hidden rounded-lg border border-primary-100 bg-primary-100 gap-px sm:grid-cols-2">
              {[
                ["Nature of Business", siteConfig.natureOfBusiness, FaStore],
                ["Additional Business", siteConfig.additionalBusiness.join(", "), FaBoxes],
                ["CEO", siteConfig.ceo, FaHandshake],
                ["GST Registration Date", siteConfig.gstSince, FaFileInvoice],
                ["Legal Status", siteConfig.legalStatus, FaTags],
                ["Year Established", siteConfig.established, FaCheckCircle],
                [
                  "Location",
                  `${siteConfig.address.city}, ${siteConfig.address.state}`,
                  FaTruckMoving,
                ],
                ["Working Hours", siteConfig.workingHours, FaStore],
              ].map(([label, value, Icon]) => {
                const InfoIcon = Icon as React.ComponentType<{ className?: string }>;
                return (
                  <div key={label as string} className="bg-white p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-50 text-secondary">
                        <InfoIcon className="h-4 w-4" />
                      </span>
                      <dt className="text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                        {label as string}
                      </dt>
                    </div>
                    <dd className="mt-4 text-lg font-extrabold leading-snug text-primary-950">
                      {value as string}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
