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
  FaEye,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import { api, type CategoryApi } from "@/lib/api";

const logoSrc = "/logo/tng%20logo.jpeg";

const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;

const companyLinks = [
  ["Our Store", "/about"],
  ["All Products", "/products"],
  ["Categories", "/categories"],
  ["Reviews", "/testimonials"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
] as const;

const buyerCards = [
  {
    title: "Retail Textiles",
    text: "Daily wear & festival selections",
    href: "/products",
    Icon: FaStore,
    external: false,
  },
  {
    title: "Wholesale Supply",
    text: "Bulk orders for shops & resellers",
    href: whatsappHref,
    Icon: FaBoxes,
    external: true,
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
    hoverText: "hover:text-[#1877F2]",
  },
  {
    href: siteConfig.socials.instagram,
    Icon: FaInstagram,
    label: "Instagram",
    hoverText: "hover:text-[#dc2743]",
  },
  {
    href: siteConfig.socials.youtube,
    Icon: FaYoutube,
    label: "YouTube",
    hoverText: "hover:text-[#FF0000]",
  },
  {
    href: whatsappHref,
    Icon: FaWhatsapp,
    label: "WhatsApp",
    hoverText: "hover:text-[#25D366]",
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
      <span className="flex flex-col gap-1">
        <a
          href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
          className="transition hover:text-secondary-light"
        >
          {siteConfig.phone}
        </a>
        <a
          href={`tel:${siteConfig.secondaryPhone.replace(/\s+/g, "")}`}
          className="transition hover:text-secondary-light"
        >
          {siteConfig.secondaryPhone}
        </a>
      </span>
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
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    api
      .publicCategories()
      .then(setCategories)
      .catch(() => { });
  }, []);

  useEffect(() => {
    const hasTrackedVisit = sessionStorage.getItem("tt-visitor-tracked");
    const request = hasTrackedVisit ? api.visitorCount() : api.trackVisitor();

    request
      .then(({ count }) => {
        setVisitorCount(count);
        sessionStorage.setItem("tt-visitor-tracked", "true");
      })
      .catch(() => {});
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-primary-950 text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-secondary/8 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-primary-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-weave-dark opacity-40" />

      {/* ── Trade CTA ── */}
      <div className="relative border-b border-white/10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

        <div className="container-x relative flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-secondary">
              <FaTags className="h-2.5 w-2.5" />
              Retail &amp; wholesale textile store
            </div>
            <h2 className="mt-4 max-w-xl text-2xl font-extrabold leading-tight tracking-tight text-white md:text-3xl">
              Need textiles for your home,{" "}
              <span className="bg-gradient-to-r from-secondary-light to-secondary bg-clip-text text-transparent">
                shop or bulk resale?
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-black text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] active:scale-95"
            >
              <FaWhatsapp className="h-4 w-4 transition group-hover:scale-110" />
              Ask on WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white/80 backdrop-blur-sm transition hover:border-secondary/40 hover:bg-white/[0.06] hover:text-white active:scale-95"
            >
              <FaPhoneAlt className="h-4 w-4" />
              Call store
            </a>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="container-x relative grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Link href="/" className="group inline-flex shrink-0 items-center gap-3 rounded bg-white p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_8px_24px_-8px_rgba(0,0,0,0.5)] ring-1 ring-red-200 transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_8px_28px_-6px_rgba(220,38,38,0.45)] hover:ring-red-300">
            <img
              src={logoSrc}
              alt={siteConfig.name}
              className="h-14 w-auto shrink-0 object-contain"
            />
            <span className="min-w-0 pr-2">
              <span className="block truncate font-display text-[1.08rem] font-extrabold tracking-tight text-primary-950 transition-colors duration-200 group-hover:text-primary-700">
                {siteConfig.name}
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-secondary-dark">
                <span className="h-px w-4 bg-gradient-to-r from-secondary to-transparent" />
                Textile since {siteConfig.established}
              </span>
            </span>
          </Link>

          <p className="mt-5 text-sm leading-7 text-white/55">
            {siteConfig.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {servicePoints.map(({ label, Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:border-secondary/30 hover:text-white/80"
              >
                <Icon className="h-3 w-3 text-secondary" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-3">
            {socials.map(({ href, Icon, label, hoverText }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition hover:-translate-y-0.5 hover:border-transparent hover:bg-white/10 ${hoverText}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="lg:col-span-2">
          <SectionLabel>Categories</SectionLabel>
          <ul className="flex flex-col gap-2.5">
            {categories.slice(-5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-secondary-light"
                >
                  <FaChevronRight className="h-2 w-2 shrink-0 text-secondary/40 transition group-hover:translate-x-0.5" />
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/categories"
                className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-secondary/70 transition hover:gap-2.5 hover:text-secondary"
              >
                All categories <FaArrowRight className="h-2 w-2" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="lg:col-span-2">
          <SectionLabel>Company</SectionLabel>
          <ul className="flex flex-col gap-2.5">
            {companyLinks.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-center gap-1.5 text-sm text-white/60 transition hover:text-secondary-light"
                >
                  <FaChevronRight className="h-2 w-2 shrink-0 text-secondary/40 transition group-hover:translate-x-0.5" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-2">
          <SectionLabel>Contact</SectionLabel>
          <ul className="flex flex-col gap-4 text-sm leading-6 text-white/60">
            {contactItems.map(({ Icon, render }, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                  <Icon className="h-3 w-3 text-secondary" />
                </span>
                <span className="mt-0.5">{render()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Business facts ── */}
      <div className="relative border-y border-white/10 bg-white/[0.015]">
        <div className="container-x grid grid-cols-2 divide-x divide-y divide-white/10 sm:divide-y-0 lg:grid-cols-4">
          {bizFacts.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="group flex items-center gap-3 px-5 py-5 transition hover:bg-white/[0.02]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-secondary/20 bg-secondary/5 transition group-hover:border-secondary/40 group-hover:bg-secondary/10">
                <Icon className="h-4 w-4 text-secondary" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-white/40">
                  {label}
                </div>
                <div className="truncate text-sm font-bold text-white">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/40 sm:flex-row">
        <span>
          © {year}{" "}
          <span className="font-semibold text-white/70">{siteConfig.name}</span>.
          All rights reserved.
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-white/55">
          <FaEye className="h-3 w-3 text-secondary" />
          {visitorCount === null ? "Website views" : `${visitorCount.toLocaleString()} website views`}
        </span>
        <span className="flex items-center gap-1.5">
          Designed by{" "}
          <a
            href="https://www.mecatronix.one"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-secondary-light transition hover:text-secondary"
          >
            Mecatronix
          </a>
          <span className="text-white/25">|</span>
          <a
            href="https://www.mecatronix.one"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white/70 transition hover:text-secondary-light"
          >
            www.mecatronix.one
          </a>
        </span>
      </div>
    </footer>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mb-5 inline-flex flex-col gap-2 text-[10px] font-bold uppercase tracking-widest text-white/65">
      {children}
      <span className="h-0.5 w-6 rounded-full bg-gradient-to-r from-secondary to-secondary/20" />
    </div>
  );
}
