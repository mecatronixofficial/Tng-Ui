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
  FaArrowRight,
  FaStore,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import { cn } from "@/utils";
import { useWishlist } from "@/store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "Our Store" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wishlistCount = useWishlist((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-5">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl transition-all duration-500",
          scrolled
            ? "bg-white/95 shadow-[0_8px_32px_-4px_rgba(4,14,48,0.12)] backdrop-blur-xl ring-1 ring-primary-100"
            : "bg-white shadow-[0_4px_24px_-4px_rgba(4,14,48,0.10)] ring-1 ring-primary-100",
        )}
      >
        {/* top accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

        {/* ── DESKTOP ── */}
        <div className="hidden h-[4.5rem] items-center gap-4 px-6 lg:flex">

          {/* Logo */}
         <Link href="/" className="group flex shrink-0 items-center gap-3 mr-3">
<span
  className="
    relative grid h-16 w-16 shrink-0 place-items-center
    overflow-hidden rounded-full bg-white
    ring-2 ring-red-100
    shadow-[0_4px_18px_rgba(220,38,38,0.18)]
    transition-all duration-300
    group-hover:bg-red-500
    group-hover:shadow-[0_6px_24px_rgba(220,38,38,0.35)]
  "
>
  <img
    src="https://res.cloudinary.com/ddpfxvydm/image/upload/v1782198017/101b65a0-c9c8-4cb8-bf78-4470b446f7e7_kpcr9z.png"
    alt={siteConfig.name}
    className="
      h-full w-full
      scale-[1.28]
      object-contain
    "
  />
</span>

  <span className="min-w-0">
    <span className="block truncate font-display text-[1.1rem] font-extrabold tracking-tight text-red-950 transition-colors duration-200 group-hover:text-red-700">
      {siteConfig.name}
    </span>

    <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-red-500">
      <span className="h-px w-4 bg-gradient-to-r from-red-600/80 to-transparent" />
      Textile manufacturer
    </span>
  </span>
</Link>

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-primary-200 to-transparent" />

          {/* Nav links */}
          <nav className="flex flex-1 items-center justify-center gap-0.5">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative rounded-xl px-4 py-2 text-[12px] font-black uppercase tracking-[0.12em] transition-colors duration-200",
                    active ? "text-primary-950" : "text-primary-500 hover:text-primary-950",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary to-secondary-dark shadow-[0_2px_12px_rgba(234,179,8,0.3)]"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-primary-200 to-transparent" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/products"
              aria-label="Search"
              className="grid h-9 w-9 place-items-center rounded-xl border border-primary-150 bg-primary-50 text-primary-500 transition-all duration-200 hover:border-primary-200 hover:bg-primary-100 hover:text-primary-950"
            >
              <FaSearch className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-9 w-9 place-items-center rounded-xl border border-primary-150 bg-primary-50 text-primary-500 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
            >
              <FaHeart className="h-3.5 w-3.5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-secondary to-secondary-dark px-1 text-[9px] font-black text-primary-950 shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            <a
              href={siteConfig.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group ml-1 inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-dark px-5 text-[11.5px] font-black uppercase tracking-[0.1em] text-primary-950 shadow-[0_2px_12px_rgba(234,179,8,0.3)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(234,179,8,0.45)] hover:brightness-110"
            >
              <FaWhatsapp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
              Enquire
            </a>
          </div>
        </div>

        {/* ── MOBILE BAR ── */}
        <div className="flex h-16 items-center justify-between px-4 lg:hidden">
          <Link href="/" className="group flex items-center gap-2.5">
            {siteConfig.logo ? (
              <img
                src={siteConfig.logo}
                alt={siteConfig.name}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-primary-100 transition-all duration-200 group-hover:ring-secondary/50"
              />
            ) : (
              <div className="grid h-9 w-9 rounded-xl place-items-center bg-gradient-to-br from-secondary to-secondary-dark text-primary-950">
                <span className="font-display text-sm font-black">T</span>
              </div>
            )}
            <span className="min-w-0">
              <span className="block max-w-[10rem] truncate font-display text-base font-extrabold tracking-tight text-primary-950">
                {siteConfig.name}
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-secondary-dark">
                Textile Manufacturer
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-9 w-9 place-items-center rounded-xl border border-primary-150 bg-primary-50 text-primary-500"
            >
              <FaHeart className="h-3.5 w-3.5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-secondary to-secondary-dark px-1 text-[9px] font-black text-primary-950 shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-secondary to-secondary-dark text-primary-950 shadow-[0_2px_10px_rgba(234,179,8,0.25)] transition-all duration-200 hover:brightness-110"
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
                    <FaTimes className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FaBars className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden border-t border-primary-100 lg:hidden"
            >
              <div className="space-y-1 px-4 pb-5 pt-3">
                {navLinks.map((link) => {
                  const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-black uppercase tracking-[0.1em] transition-all duration-200",
                        active
                          ? "bg-gradient-to-r from-secondary to-secondary-dark text-primary-950 shadow-[0_2px_10px_rgba(234,179,8,0.25)]"
                          : "text-primary-600 hover:bg-primary-50 hover:text-primary-950",
                      )}
                    >
                      {link.label}
                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-950/30" />
                      ) : (
                        <FaArrowRight className="h-2.5 w-2.5 opacity-30" />
                      )}
                    </Link>
                  );
                })}

                <div className="!my-3 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/products"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-150 bg-primary-50 px-5 py-3 text-sm font-black text-primary-700 transition-all duration-200 hover:bg-primary-100"
                  >
                    <FaSearch className="h-3.5 w-3.5 text-primary-400" />
                    Browse Products
                  </Link>
                  <a
                    href={siteConfig.socials.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-dark px-5 py-3 text-sm font-black text-primary-950 shadow-[0_2px_10px_rgba(234,179,8,0.25)] transition-all duration-200 hover:brightness-110"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
