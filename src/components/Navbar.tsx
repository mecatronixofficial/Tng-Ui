"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaSearch,
  FaHeart,
  FaBars,
  FaTimes,
  FaWhatsapp,
  FaChevronDown,
  FaPhoneAlt,
  FaStore,
  FaBoxes,
  FaTruckMoving,
  FaTags,
  FaLeaf,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import { api, type CategoryApi } from "@/lib/api";
import { cn } from "@/utils";
import { useWishlist } from "@/store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Cloth Range" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "Our Store" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

const buyerLinks = [
  {
    href: "/products",
    label: "Retail Cloths",
    description: "Single pieces and family shopping",
    icon: FaStore,
  },
  {
    href: "/products",
    label: "Wholesale Cloths",
    description: "Bulk supply for shops and traders",
    icon: FaBoxes,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const wishlistCount = useWishlist((s) => s.items.length);

  useEffect(() => {
    api.publicCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShopOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility strip */}
      <div className="relative overflow-hidden bg-ink bg-weave-dark">
        <div className="container-x flex h-9 items-center justify-between gap-4 text-xs">
          <div className="hidden lg:flex items-center gap-4 font-medium text-white/75">
            <span className="inline-flex items-center gap-1.5 text-white/90">
              <FaLeaf className="h-3 w-3 text-secondary" />
              Est. {siteConfig.established} · {siteConfig.address.city}
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="inline-flex items-center gap-1.5">
              <FaTags className="h-3 w-3 text-secondary-light" />
              Retail &amp; wholesale direct from mill
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span>{siteConfig.workingHours.replace("Mon – Sat: ", "")}</span>
          </div>
          <span className="lg:hidden text-white/90 font-medium">
            Retail &amp; wholesale · {siteConfig.address.city}
          </span>
          <div className="flex shrink-0 items-center gap-4">
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 text-white/75 hover:text-secondary-light transition-colors duration-200"
            >
              <FaPhoneAlt className="h-2.5 w-2.5" />
              {siteConfig.phone}
            </a>
            <a
              href={siteConfig.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-white/75 hover:text-secondary-light transition-colors duration-200"
            >
              <FaWhatsapp className="h-3 w-3" /> Quick quote
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "transition-all duration-300 border-b",
          scrolled
            ? "bg-white/97 backdrop-blur-lg border-cream-200/70 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.1)]"
            : "bg-white/92 backdrop-blur-sm border-cream-200/50",
        )}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex min-w-0 items-center gap-3 group">
            {siteConfig.logo ? (
              <img
                src={siteConfig.logo}
                alt={siteConfig.name}
                className="h-11 w-11 rounded-xl object-cover"
              />
            ) : (
              <div className="relative shrink-0">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft transition-all duration-300 group-hover:shadow-warm group-hover:scale-105">
                  <FaStore className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-600" />
              </div>
            )}

            <div className="min-w-0 leading-tight">
              <div className="truncate font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
                {siteConfig.name}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider-x">
                <span className="text-primary-600">Retail</span>
                <span className="h-1 w-1 rounded-full bg-green-600" />
                <span className="text-green-700">Wholesale</span>
                <span className="hidden sm:inline text-ink-muted">· Cloths</span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              if (link.href === "/products") {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setShopOpen(true)}
                    onMouseLeave={() => setShopOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold tracking-wide transition-all duration-200",
                        active
                          ? "text-primary-600"
                          : "text-ink hover:text-primary-600",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg bg-primary-50 -z-10"
                        />
                      )}
                      {!active && shopOpen && (
                        <span className="absolute inset-0 rounded-lg bg-cream-100 -z-10" />
                      )}
                      {link.label}
                      <FaChevronDown
                        className={cn(
                          "h-2.5 w-2.5 transition-transform duration-200",
                          shopOpen && "rotate-180",
                        )}
                      />
                    </Link>

                    <AnimatePresence>
                      {shopOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute left-0 top-full w-[580px] pt-3"
                        >
                          <div className="rounded-2xl border border-cream-200/80 bg-white/95 p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                            <div className="grid grid-cols-2 gap-2.5 border-b border-cream-200 pb-4">
                              {buyerLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    className="group flex items-start gap-3 rounded-xl border border-cream-200 bg-cream-50 px-3.5 py-3 transition-all duration-200 hover:border-primary-200 hover:bg-primary-50 hover:shadow-sm"
                                  >
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm transition-all duration-200 group-hover:from-green-600 group-hover:to-green-800">
                                      <Icon className="h-4 w-4" />
                                    </span>
                                    <span>
                                      <span className="block text-sm font-bold text-ink transition-colors group-hover:text-primary-600">
                                        {item.label}
                                      </span>
                                      <span className="mt-0.5 block text-xs leading-5 text-ink-muted">
                                        {item.description}
                                      </span>
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>

                            <div className="flex items-center gap-3 px-1 pb-2 pt-4">
                              <span className="h-px flex-1 bg-cream-200" />
                              <span className="text-[9px] font-bold uppercase tracking-widest-x text-green-700">
                                Popular cloth categories
                              </span>
                              <span className="h-px flex-1 bg-cream-200" />
                            </div>

                            <div className="grid grid-cols-2 gap-1">
                              {categories.map((c) => (
                                <Link
                                  key={c.id}
                                  href={`/products?category=${c.slug}`}
                                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-cream-100"
                                >
                                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-200 ring-1 ring-cream-300 transition-all duration-300 group-hover:ring-primary-200">
                                    <img
                                      src={c.image}
                                      alt={c.name}
                                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-ink transition-colors group-hover:text-primary-600">
                                      {c.name}
                                    </div>
                                    <div className="text-xs text-ink-muted">
                                      {c.productCount} items
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>

                            <Link
                              href="/products"
                              className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-cream-200 bg-cream-50 py-3 text-xs font-bold uppercase tracking-wider-x text-primary-600 transition-all duration-200 hover:border-primary-200 hover:bg-primary-50"
                            >
                              <FaTruckMoving className="h-3.5 w-3.5" />
                              View all retail &amp; wholesale products
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-sm font-semibold tracking-wide transition-all duration-200",
                    active
                      ? "text-primary-600"
                      : "text-ink hover:bg-cream-100 hover:text-primary-600",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-primary-50 -z-10"
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/products"
              className="hidden h-9 w-9 place-items-center rounded-lg text-ink-soft transition-all duration-200 hover:bg-cream-100 hover:text-primary-600 sm:grid"
              aria-label="Search"
            >
              <FaSearch className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/wishlist"
              className="relative grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition-all duration-200 hover:bg-cream-100 hover:text-primary-600"
              aria-label="Wishlist"
            >
              <FaHeart className="h-3.5 w-3.5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-green-600 px-1 text-[9px] font-bold text-white shadow-sm"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
            <a
              href={siteConfig.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="ml-2 hidden items-center gap-2 rounded-xl bg-gradient-to-br from-green-600 to-green-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-warm transition-all duration-200 hover:from-green-500 hover:to-green-700 hover:shadow-[0_8px_24px_-6px_rgba(var(--color-accent-700),0.5)] md:inline-flex"
            >
              <FaWhatsapp className="h-4 w-4" />
              Bulk Enquiry
            </a>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg text-ink transition-all duration-200 hover:bg-cream-100 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FaTimes className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FaBars className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-cream-200 bg-white/97 backdrop-blur-xl lg:hidden shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)]"
          >
            <div className="container-x space-y-4 py-5">
              {/* Buyer type cards */}
              <div className="grid grid-cols-2 gap-2.5">
                {buyerLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group rounded-xl border border-cream-200 bg-cream-50 p-3.5 transition-all duration-200 hover:border-primary-200 hover:bg-primary-50"
                    >
                      <div className="mb-2.5 grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="block text-sm font-bold text-ink transition-colors group-hover:text-primary-600">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-ink-muted">
                        {item.description}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Nav links */}
              <div className="space-y-0.5">
                {navLinks.map((link) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        "flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                        active
                          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft"
                          : "text-ink-soft hover:bg-cream-100 hover:text-ink",
                      )}
                    >
                      {link.label}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="border-t border-cream-200 pt-4">
                  <div className="mb-3 flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest-x text-green-700">
                    <span className="h-px flex-1 bg-cream-200" />
                    Shop by category
                    <span className="h-px flex-1 bg-cream-200" />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {categories.slice(0, 6).map((c) => (
                      <Link
                        key={c.id}
                        href={`/products?category=${c.slug}`}
                        className="rounded-xl bg-cream-100 px-2.5 py-2.5 text-center text-xs font-semibold text-ink transition-all duration-200 hover:bg-primary-50 hover:text-primary-600"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp CTA */}
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-warm transition-all duration-200 hover:from-green-500 hover:to-green-700"
              >
                <FaWhatsapp className="h-4 w-4" /> Ask on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
