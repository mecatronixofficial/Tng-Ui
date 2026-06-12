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
    accent: "group-hover:bg-primary-600",
  },
  {
    title: "Wholesale Supply",
    text: "Bulk cloth orders for shops, resellers and traders.",
    href: siteConfig.socials.whatsapp,
    Icon: FaBoxes,
    external: true,
    accent: "group-hover:bg-secondary-dark",
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
    hover: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white",
  },
  {
    href: siteConfig.socials.instagram,
    Icon: FaInstagram,
    label: "Instagram",
    hover: "hover:bg-[#E1306C] hover:border-[#E1306C] hover:text-white",
  },
  {
    href: siteConfig.socials.youtube,
    Icon: FaYoutube,
    label: "YouTube",
    hover: "hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white",
  },
  {
    href: siteConfig.socials.whatsapp,
    Icon: FaWhatsapp,
    label: "WhatsApp",
    hover: "hover:bg-[#25D366] hover:border-[#25D366] hover:text-white",
  },
];

const bizFacts = [
  { label: "Established", value: siteConfig.established },
  { label: "Business", value: "Retail & Wholesale" },
  { label: "GST Since", value: siteConfig.gstSince },
  { label: "Nature", value: siteConfig.natureOfBusiness },
];

export default function Footer() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<CategoryApi[]>([]);

  useEffect(() => {
    api.publicCategories().then(setCategories).catch(() => {});
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cream-200 bg-white text-ink">
      {/* Trade CTA */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
        {/* Blobs */}
        <div className="pointer-events-none absolute -left-20 -top-12 h-72 w-72 rounded-full bg-primary-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-0 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />

        <div className="container-x relative grid gap-6 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-secondary">
              <FaTags className="h-2.5 w-2.5" />
              Retail and wholesale cloth store
            </div>
            <h2 className="max-w-2xl text-2xl font-extrabold tracking-tight text-white md:text-[1.75rem] md:leading-snug">
              Need cloths for your home,&nbsp;shop, or bulk resale?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
              Share your requirement on WhatsApp for petticoats, lungis, towels,
              gamcha, bed sheets, dhotis and handloom cloths.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a
              href={siteConfig.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#1ebe5d] active:scale-95"
            >
              <FaWhatsapp className="h-4 w-4" />
              Ask on WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.07] px-6 py-3 text-sm font-bold text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 active:scale-95"
            >
              <FaPhoneAlt className="h-4 w-4" />
              Call store
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3">
            {siteConfig.logo ? (
              <img
                src={siteConfig.logo}
                alt={siteConfig.name}
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-cream-200"
              />
            ) : (
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-200">
                <FaStore className="h-5 w-5" />
              </span>
            )}
            <span>
              <span className="block text-xl font-extrabold tracking-tight text-ink">
                {siteConfig.name}
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-primary-600">
                Retail • Wholesale • Cloths
              </span>
            </span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-7 text-ink-muted">
            {siteConfig.description}
          </p>

          <div className="mt-6 grid gap-2">
            {servicePoints.map(({ label, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-cream-200 bg-cream-50 px-3 py-2.5 text-sm font-semibold text-ink transition hover:border-primary-200 hover:bg-primary-50/40"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            {socials.map(({ href, Icon, label, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={`grid h-10 w-10 place-items-center rounded-xl border border-cream-200 bg-white text-ink-muted transition ${hover}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Buyer cards */}
        <div className="lg:col-span-3">
          <SectionLabel>Buy From Us</SectionLabel>
          <div className="grid gap-3">
            {buyerCards.map(({ title, text, href, Icon, external, accent }) => {
              const cls =
                "group rounded-xl border border-cream-200 bg-cream-50 p-4 transition hover:border-primary-200 hover:bg-white hover:shadow-md hover:shadow-primary-100/60";
              const content = (
                <>
                  <span
                    className={`mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary-100 text-primary-600 transition ${accent} group-hover:text-white`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="block text-sm font-extrabold text-ink">
                    {title}
                  </span>
                  <span className="mt-1.5 block text-xs leading-5 text-ink-muted">
                    {text}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary-600 transition group-hover:gap-2.5">
                    Enquire now <FaArrowRight className="h-2.5 w-2.5" />
                  </span>
                </>
              );

              return external ? (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={cls}
                >
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
          <SectionLabel>Cloth Range</SectionLabel>
          <ul className="space-y-1.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-muted transition hover:bg-primary-50 hover:text-primary-600"
                >
                  <FaChevronRight className="h-2.5 w-2.5 shrink-0 text-primary-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <SectionLabel>Visit Or Contact</SectionLabel>
          <ul className="space-y-4">
            <ContactItem Icon={FaMapMarkerAlt} iconColor="text-primary-600" iconBg="bg-primary-50">
              {siteConfig.address.line2},<br />
              {siteConfig.address.city}, {siteConfig.address.state} –{" "}
              {siteConfig.address.pincode}
            </ContactItem>
            <ContactItem Icon={FaPhoneAlt} iconColor="text-secondary" iconBg="bg-secondary/10">
              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="transition hover:text-primary-600"
              >
                {siteConfig.phone}
              </a>
            </ContactItem>
            <ContactItem Icon={FaEnvelope} iconColor="text-primary-600" iconBg="bg-primary-50">
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition hover:text-primary-600"
              >
                {siteConfig.email}
              </a>
            </ContactItem>
            <ContactItem Icon={FaClock} iconColor="text-ink" iconBg="bg-cream-100">
              {siteConfig.workingHours}
            </ContactItem>
          </ul>

          <div className="mt-7 rounded-xl border border-cream-200 bg-cream-50 p-4">
            <div className="flex items-center gap-2">
              <span className="h-4 w-0.5 rounded-full bg-primary-500" />
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink">
                Quick Links
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
              {companyLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1 text-xs font-semibold text-ink-muted transition hover:text-primary-600"
                >
                  <FaChevronRight className="h-2 w-2 shrink-0 text-primary-400" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Business facts */}
      <div className="border-y border-cream-200 bg-cream-50/80">
        <div className="container-x grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {bizFacts.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-cream-200 bg-white px-4 py-3.5 shadow-sm"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary-500">
                {label}
              </div>
              <div className="mt-1 text-sm font-extrabold text-ink">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-cream-50/60">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-muted sm:flex-row">
          <span>
            © {year}{" "}
            <span className="font-semibold text-ink">{siteConfig.name}</span>.
            All rights reserved.
          </span>
          <span className="text-center">
            Retail and wholesale cloths from{" "}
            <span className="font-semibold text-ink">
              {siteConfig.address.city}, {siteConfig.address.state}
            </span>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="h-4 w-0.5 rounded-full bg-primary-500" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-ink">
        {children}
      </span>
    </div>
  );
}

function ContactItem({
  Icon,
  children,
  iconColor,
  iconBg,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${iconBg} ${iconColor}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-sm leading-6 text-ink-muted">{children}</span>
    </li>
  );
}
