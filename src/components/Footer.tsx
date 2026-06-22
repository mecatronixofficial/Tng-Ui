"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaChevronRight,
  FaArrowRight,
  FaStore,
  FaBoxes,
  FaTruckMoving,
  FaIndustry,
  FaTags,
  FaGem,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import { api, type CategoryApi } from "@/lib/api";

const companyLinks = [
  ["Our Store", "/about"],
  ["All Cloths", "/products"],
  ["Categories", "/categories"],
  ["Reviews", "/testimonials"],
  ["Contact", "/contact"],
] as const;

const buyerCards = [
  {
    title: "Retail Cloths",
    text: "Daily wear, family shopping and festival cloth selections.",
    href: "/products",
    Icon: FaStore,
    external: false,
    iconBg: "bg-primary-600",
  },
  {
    title: "Wholesale Supply",
    text: "Bulk cloth orders for shops, resellers and traders.",
    href: siteConfig.socials.whatsapp,
    Icon: FaBoxes,
    external: true,
    iconBg: "bg-secondary",
  },
] as const;

const servicePoints = [
  { label: "Retail & wholesale", Icon: FaTags },
  { label: "Direct textile supply", Icon: FaIndustry },
  { label: "Pan-India despatch", Icon: FaTruckMoving },
] as const;

const socials = [
  {
    href: siteConfig.socials.facebook,
    Icon: FaFacebookF,
    label: "Facebook",
    bg: "bg-[#1877F2]",
    shadow: "shadow-[0_8px_24px_-8px_rgba(24,119,242,0.65)]",
  },
  {
    href: siteConfig.socials.instagram,
    Icon: FaInstagram,
    label: "Instagram",
    bg: "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]",
    shadow: "shadow-[0_8px_24px_-8px_rgba(220,39,67,0.65)]",
  },
  {
    href: siteConfig.socials.youtube,
    Icon: FaYoutube,
    label: "YouTube",
    bg: "bg-[#FF0000]",
    shadow: "shadow-[0_8px_24px_-8px_rgba(255,0,0,0.65)]",
  },
  {
    href: siteConfig.socials.whatsapp,
    Icon: FaWhatsapp,
    label: "WhatsApp",
    bg: "bg-[#25D366]",
    shadow: "shadow-[0_8px_24px_-8px_rgba(37,211,102,0.65)]",
  },
];

const bizFacts = [
  { label: "Established", value: siteConfig.established, Icon: FaStar },
  { label: "Business Type", value: "Retail & Wholesale", Icon: FaStore },
  { label: "GST Since", value: siteConfig.gstSince, Icon: FaShieldAlt },
  { label: "Nature", value: siteConfig.natureOfBusiness, Icon: FaGem },
];

const contactItems = [
  {
    Icon: FaMapMarkerAlt,
    render: () => (
      <>
        {siteConfig.address.line2},<br />
        {siteConfig.address.city}, {siteConfig.address.state} –{" "}
        {siteConfig.address.pincode}
      </>
    ),
  },
  {
    Icon: FaPhoneAlt,
    render: () => (
      <a
        href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
        className="transition hover:text-secondary-light"
      >
        {siteConfig.phone}
      </a>
    ),
  },
  {
    Icon: FaEnvelope,
    render: () => (
      <a
        href={`mailto:${siteConfig.email}`}
        className="transition hover:text-secondary-light"
      >
        {siteConfig.email}
      </a>
    ),
  },
  {
    Icon: FaClock,
    render: () => <>{siteConfig.workingHours}</>,
  },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<CategoryApi[]>([]);

  useEffect(() => {
    api
      .publicCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-primary-950 text-white">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-secondary/8 blur-[130px]" />
        <div className="absolute -right-40 bottom-1/3 h-[380px] w-[380px] rounded-full bg-primary-700/25 blur-[110px]" />
        <div className="absolute inset-0 bg-weave-dark opacity-[0.15]" />
      </div>

      {/* ── Trade CTA ── */}
      <div className="relative overflow-hidden border-b border-white/[0.07]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-950/90 to-primary-950" />
        <div className="absolute inset-0 bg-weave-dark opacity-20" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent" />

        <div className="container-x relative grid gap-8 py-14 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-secondary shadow-[0_0_20px_-6px_rgba(212,175,55,0.5)]">
              <FaTags className="h-2.5 w-2.5" />
              Retail &amp; wholesale cloth store
            </div>
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white md:text-[2rem]">
              Need cloths for your home,{" "}
              <span className="bg-gradient-to-r from-secondary-light to-secondary bg-clip-text text-transparent">
                shop, or bulk resale?
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
              Share your requirement on WhatsApp for petticoats, lungis, towels,
              gamcha, bed sheets, dhotis and handloom cloths.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={siteConfig.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 py-3.5 text-sm font-black text-white shadow-[0_16px_40px_-16px_rgba(37,211,102,0.75)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] active:scale-95"
            >
              <FaWhatsapp className="h-4 w-4" />
              Ask on WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-secondary/25 bg-secondary/8 px-7 py-3.5 text-sm font-bold text-white/85 transition hover:-translate-y-0.5 hover:border-secondary/50 hover:bg-secondary/15 active:scale-95"
            >
              <FaPhoneAlt className="h-4 w-4" />
              Call store
            </a>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="relative">
        <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-12">

          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              {siteConfig.logo ? (
                <img
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-secondary/30 shadow-[0_0_28px_-6px_rgba(212,175,55,0.45)] transition group-hover:ring-secondary/60"
                />
              ) : (
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-secondary-light to-secondary text-primary-950 shadow-[0_0_28px_-6px_rgba(212,175,55,0.55)] transition group-hover:shadow-[0_0_40px_-4px_rgba(212,175,55,0.8)]">
                  <FaStore className="h-6 w-6" />
                </span>
              )}
              <span>
                <span className="block text-xl font-extrabold tracking-tight text-white transition group-hover:text-secondary-light">
                  {siteConfig.name}
                </span>
                <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-secondary/70">
                  Retail · Wholesale · Cloths
                </span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-white/55">
              {siteConfig.description}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              {servicePoints.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-primary-900/40 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-secondary/25 hover:bg-primary-800/40 hover:text-secondary-light"
                >
                  <span className="shrink-0 text-secondary transition group-hover:scale-110">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-7">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/35">
                Follow us
              </div>
              <div className="flex items-center gap-2.5">
                {socials.map(({ href, Icon, label, bg, shadow }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className={`grid h-11 w-11 place-items-center rounded-xl text-white transition hover:-translate-y-1 hover:scale-105 active:scale-95 ${bg} ${shadow}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Buyer cards */}
          <div className="lg:col-span-3">
            <SectionLabel icon={<FaStore className="h-3 w-3" />}>Buy From Us</SectionLabel>
            <div className="grid gap-3">
              {buyerCards.map(({ title, text, href, Icon, external, iconBg }) => {
                const cls =
                  "group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-primary-900/50 p-5 transition hover:-translate-y-1 hover:border-secondary/30 hover:bg-primary-800/50 hover:shadow-[0_20px_50px_-20px_rgba(212,175,55,0.3)]";
                const content = (
                  <>
                    <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
                    <span className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ${iconBg} text-white shadow-lg transition group-hover:scale-105`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="block text-sm font-extrabold text-white">{title}</span>
                    <span className="mt-1.5 block text-xs leading-5 text-white/50">{text}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-secondary transition-all group-hover:gap-3 group-hover:text-secondary-light">
                      Enquire now <FaArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </>
                );

                return external ? (
                  <a key={title} href={href} target="_blank" rel="noreferrer" className={cls}>
                    {content}
                  </a>
                ) : (
                  <Link key={title} href={href} className={cls}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <SectionLabel icon={<FaTags className="h-3 w-3" />}>Categories</SectionLabel>
            <div className="flex flex-col gap-1.5">
              {categories.slice(-5).map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-primary-900/30 px-3.5 py-2.5 text-sm font-medium text-white/60 transition hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary-light"
                >
                  <span className="flex items-center gap-2">
                    <FaGem className="h-2.5 w-2.5 text-secondary/50 transition group-hover:text-secondary" />
                    {c.name}
                  </span>
                  <FaChevronRight className="h-2.5 w-2.5 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
              <Link
                href="/categories"
                className="mt-1 inline-flex items-center gap-1.5 px-1 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary/70 transition hover:text-secondary"
              >
                All categories <FaArrowRight className="h-2 w-2" />
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <SectionLabel icon={<FaPhoneAlt className="h-2.5 w-2.5" />}>Visit Or Contact</SectionLabel>
            <div className="flex flex-col gap-2.5">
              {contactItems.map(({ Icon, render }, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-primary-900/30 px-4 py-3 transition hover:border-secondary/20 hover:bg-primary-800/40"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary/15 text-secondary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm leading-6 text-white/60">{render()}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-primary-900/40">
              <div className="border-b border-white/[0.07] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-secondary/70">
                Quick Links
              </div>
              <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
                {companyLinks.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-1.5 bg-primary-950 px-4 py-3 text-xs font-semibold text-white/55 transition hover:bg-primary-900/60 hover:text-secondary-light"
                  >
                    <FaChevronRight className="h-2 w-2 shrink-0 text-secondary/50" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Business facts ── */}
      <div className="relative border-y border-white/[0.07]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="container-x grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {bizFacts.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-primary-900/40 px-5 py-4 transition hover:border-secondary/25 hover:bg-primary-800/50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary/15 text-secondary transition group-hover:scale-110 group-hover:bg-secondary/25">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</div>
                <div className="mt-0.5 text-sm font-extrabold text-white">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative bg-primary-950">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/25 to-transparent" />
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/40 sm:flex-row">
          <span>
            © {year}{" "}
            <span className="font-semibold text-white/70">{siteConfig.name}</span>.
            All rights reserved.
          </span>
          <span className="flex items-center gap-1.5">
            <FaGem className="h-2.5 w-2.5 text-secondary/60" />
            Retail &amp; wholesale cloths from{" "}
            <span className="font-semibold text-white/70">
              {siteConfig.address.city}, {siteConfig.address.state}
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function SectionLabel({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      {icon && (
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-secondary/15 text-secondary">
          {icon}
        </span>
      )}
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/65">
        {children}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}
