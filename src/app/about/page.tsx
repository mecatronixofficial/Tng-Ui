import type { Metadata } from "next";
import Link from "next/link";
import {
  FaArrowRight,
  FaBoxes,
  FaCheckCircle,
  FaFileInvoice,
  FaHandshake,
  FaIndustry,
  FaLeaf,
  FaQuestionCircle,
  FaQuoteRight,
  FaShippingFast,
  FaStore,
  FaTags,
  FaTruckMoving,
  FaTshirt,
  FaWeight,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import StatsCounter from "@/components/StatsCounter";
import { loadCategories, loadFaqs } from "@/lib/data";
import { siteConfig, stats, whyChooseUs } from "@/data/site";
import FAQAccordion from "@/components/FAQAccordion";

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

const tradeSteps = [
  "Share cloth type, quantity and delivery city",
  "Receive product options and availability",
  "Confirm packing, colour and size requirement",
  "We prepare and despatch your order",
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

const iconMap = {
  FaIndustry,
  FaTshirt,
  FaWeight,
  FaHandshake,
  FaShippingFast,
  FaLeaf,
};

const [faqs] =
  await Promise.all([
    loadFaqs(),
  ]);

export default async function AboutPage() {
  const aboutOfficeImages = [
    siteConfig.office.workplace4,
    siteConfig.office.workplace5,
  ];

const banner = "/banners/WhatsApp%20Image%202026-07-21%20at%2023.39.25.jpeg";
  return (
    <>
      <PageHero
        eyebrow="About the store"
        title="Retail and wholesale cloth supply from Erode."
        subtitle={`${siteConfig.name} serves families, shop owners and textile traders with practical cotton and handloom products since ${siteConfig.established}.`}
        bgImage={banner}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Buyer profile */}
      <section className="section-y bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-primary-100">
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={aboutOfficeImages[1]}
                  alt={`${siteConfig.name} office and cloth display`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-primary-100 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary-500">
                {siteConfig.address.city}, {siteConfig.address.state}
              </div>
              <div className="mt-1 text-lg font-bold text-primary-950">
                Cloths for homes, shops and traders.
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SectionTitle
              eyebrow="Who we serve"
              title="A cloth business built for both walk-in needs and bulk trade."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {buyerPaths.map(({ title, text, Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-primary-100 p-5"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-primary-950">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-6 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300"
              >
                View Cloth Range <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-6 py-3 text-sm font-bold text-ink transition hover:border-primary-300"
              >
                <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
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

      {/* Why choose */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionTitle
            eyebrow={`Why ${siteConfig.name}`}
            title="Retail care. Wholesale discipline."
            align="center"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item, i) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-primary-100 bg-white p-6 transition hover:border-primary-300"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-600">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <h3 className="text-base font-bold leading-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {item.description}
                  </p>
                </div>
              );
            })}
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
              light
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {promises.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-white/10 p-4"
              >
                <FaCheckCircle className="mt-1 h-4 w-4 shrink-0 text-secondary" />
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
        <div className="container-x grid items-stretch gap-5 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl bg-primary-950 p-7 text-white shadow-warm md:p-10 lg:col-span-7">
            <div className="absolute right-6 top-6 hidden text-secondary/15 md:block">
              <FaQuoteRight className="h-24 w-24" />
            </div>

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-secondary-light">
                <FaHandshake className="h-3 w-3" />
                From the founder
              </div>

              <blockquote className="max-w-3xl text-2xl font-extrabold leading-tight text-white md:text-4xl">
                &ldquo;We believe cloth buying should be simple, clear and dependable
                for every retail customer and wholesale buyer.&rdquo;
              </blockquote>

              <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-white/70 md:text-base">
                Everyday products, repeat stock details and honest despatch
                timelines help buyers place orders with confidence.
              </p>

              <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-extrabold text-white">
                    {siteConfig.ceo}
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-secondary-light">
                    Founder, {siteConfig.name}
                  </div>
                </div>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-extrabold text-primary-950 transition hover:bg-secondary-light"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Discuss Order
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[430px] rounded-2xl bg-red-200 p-1 shadow-warm">
              <div className="h-full rounded-xl border border-secondary/40 bg-white p-3">
                <div className="relative flex h-full min-h-[400px] flex-col overflow-hidden rounded-lg bg-primary-50">
                  <div className="relative mt-auto flex min-h-[360px] items-end justify-center px-6 ">
                    <img
                      src={siteConfig.ownerPhoto}
                      alt={`${siteConfig.ceo} - Founder of ${siteConfig.name}`}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-soft md:p-7 lg:col-span-12">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary-500">
              Simple order flow
            </div>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <h3 className="max-w-xl text-2xl font-extrabold leading-tight text-primary-950">
                From cloth selection to despatch, every step stays clear.
              </h3>
              <p className="max-w-md text-sm font-semibold leading-6 text-ink-muted">
                A practical buying process for retail customers, shop owners
                and wholesale partners.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {tradeFlow.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-primary-100 bg-primary-50 p-4"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-xs font-extrabold text-primary-800 shadow-soft">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm font-bold leading-6 text-ink">
                    {item}
                  </span>
                </div>
              ))}
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
            />
          </div>
          <div className="lg:col-span-8">
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-primary-100 sm:grid-cols-2">
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
                    <div className="flex items-center gap-2">
                      <InfoIcon className="h-3.5 w-3.5 text-primary-500" />
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-primary-500">
                        {label as string}
                      </dt>
                    </div>
                    <dd className="mt-3 text-base font-bold leading-snug text-primary-950">
                      {value as string}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden section-y bg-gradient-to-b from-primary-50/70 to-white">
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="Quick Answers"
              title="Retail and wholesale questions"
              description="Can't find what you're looking for? Send us your question directly."
            />
            <Link
              href="/contact"
              className="btn-outline rounded-xl bg-white shadow-soft"
            >
              <FaQuestionCircle className="h-3.5 w-3.5" />
              Ask Your Own
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-[0_18px_60px_-34px_rgba(4,14,48,0.55)] lg:col-span-8">
            <FAQAccordion items={faqs.slice(0, 5)} />
          </div>
        </div>
      </section>
    </>
  );
}
