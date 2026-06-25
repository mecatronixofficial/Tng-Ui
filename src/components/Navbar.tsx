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
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import { cn } from "@/utils";
import { useWishlist } from "@/store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "Our Store" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const logoSrc =
  siteConfig.logo ||
  "https://res.cloudinary.com/ddpfxvydm/image/upload/v1782198017/101b65a0-c9c8-4cb8-bf78-4470b446f7e7_kpcr9z.png";

const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "relative border-b transition-all duration-500",
          scrolled
            ? "border-primary-100 bg-white/95 shadow-[0_12px_32px_-24px_rgba(45,5,5,0.4)] backdrop-blur-xl"
            : "border-primary-100 bg-white/90 backdrop-blur-md",
        )}
      >
        {/* top accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

        {/* ── DESKTOP ── */}
        <div className="container-x hidden h-20 items-center gap-5 lg:flex">

          {/* Logo */}
          <Link href="/" className="group mr-2 flex min-w-0 shrink-0 items-center gap-3">
            <span
              className="
                relative grid h-14 w-14 shrink-0 place-items-center
                overflow-hidden rounded-xl bg-primary-800
                ring-1 ring-red-200
                shadow-[0_4px_18px_rgba(220,38,38,0.14)]
                transition-all duration-300
                group-hover:ring-red-200
                group-hover:shadow-[0_6px_24px_rgba(220,38,38,0.24)]
              "
            >
              <img
                src={logoSrc}
                alt={siteConfig.name}
                className="
                  h-full w-full
                  scale-[1.22]
                  object-contain
                "
              />
            </span>

            <span className="hidden min-w-0 xl:block">
              <span className="block truncate font-display text-[1.08rem] font-extrabold tracking-tight text-primary-950 transition-colors duration-200 group-hover:text-primary-700">
                {siteConfig.name}
              </span>

              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-secondary-dark">
                <span className="h-px w-4 bg-gradient-to-r from-secondary to-transparent" />
                Textile manufacturer
              </span>
            </span>
          </Link>

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-primary-200 to-transparent" />

          {/* Nav links */}
          <nav className="flex flex-1 items-center justify-center gap-0">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-2 py-2 text-[10px] font-black uppercase tracking-[0.08em] transition-colors duration-200 xl:px-3 xl:text-[11px]",
                    active ? "text-white" : "text-primary-600 hover:text-primary-950",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 shadow-[0_8px_18px_-12px_rgba(45,5,5,0.55)]"
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
              className="grid h-10 w-10 place-items-center rounded-lg border border-primary-100 bg-white text-primary-600 transition-all duration-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-950"
            >
              <FaSearch className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-primary-100 bg-white text-primary-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
            >
              <FaHeart className="h-3.5 w-3.5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-secondary px-1 text-[9px] font-black text-white shadow-[0_0_8px_rgba(220,38,38,0.35)]"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group ml-1 inline-flex h-10 items-center gap-2 rounded-lg bg-primary-600 px-5 text-[11.5px] font-black uppercase tracking-[0.1em] text-white shadow-soft transition-all duration-300 hover:bg-primary-700 hover:shadow-warm"
            >
              <FaWhatsapp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
              Enquire
            </a>
          </div>
        </div>

        {/* ── MOBILE BAR ── */}
        <div className="container-x flex h-16 items-center justify-between lg:hidden">
          <Link href="/" className="group flex items-center gap-2.5">
            <img
              src={logoSrc}
              alt={siteConfig.name}
              className="h-10 w-10 rounded-lg bg-primary-800 object-contain scale-[1.18] ring-1 ring-red-200 transition-all duration-200 group-hover:ring-red-200"
            />
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
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-primary-100 bg-white text-primary-600"
            >
              <FaHeart className="h-3.5 w-3.5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-secondary px-1 text-[9px] font-black text-white shadow-[0_0_8px_rgba(220,38,38,0.35)]"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg bg-primary-600 text-white shadow-soft transition-all duration-200 hover:bg-primary-700"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
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
              className="overflow-hidden border-t border-primary-100 bg-white lg:hidden"
            >
              <div className="container-x space-y-1 pb-5 pt-3">
                {navLinks.map((link) => {
                  const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-black uppercase tracking-[0.1em] transition-all duration-200",
                        active
                          ? "bg-primary-600 text-white shadow-soft"
                          : "text-primary-600 hover:bg-primary-50 hover:text-primary-950",
                      )}
                    >
                      {link.label}
                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
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
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-100 bg-primary-50 px-5 py-3 text-sm font-black text-primary-700 transition-all duration-200 hover:bg-primary-100"
                  >
                    <FaSearch className="h-3.5 w-3.5 text-primary-400" />
                    Browse Products
                  </Link>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-black text-white shadow-soft transition-all duration-200 hover:bg-primary-700"
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
