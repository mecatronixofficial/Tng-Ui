import Link from "next/link";
import {
  FaBoxes,
  FaHome,
  FaPhoneAlt,
  FaShoppingBag,
  FaStore,
  FaTags,
  FaWhatsapp,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";

const paths = [
  {
    title: "Retail Cloths",
    text: "Browse daily wear, home-use and family shopping products.",
    href: "/products",
    Icon: FaStore,
  },
  {
    title: "Wholesale Supply",
    text: "Ask for bulk supply for shops, traders and resellers.",
    href: siteConfig.socials.whatsapp,
    Icon: FaBoxes,
    external: true,
  },
  {
    title: "Categories",
    text: "Find petticoats, lungis, towels, bed sheets and more.",
    href: "/categories",
    Icon: FaTags,
  },
];

export default function NotFound() {
  return (
    <main className="bg-cream-50">
      <section className="container-x grid min-h-[78vh] gap-10 py-16 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-lg border border-secondary/30 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800 shadow-soft">
            <FaTags className="h-3 w-3 text-secondary" />
            Error 404
          </div>

          <h1 className="mt-6 text-6xl font-extrabold leading-none tracking-tight text-primary-950 md:text-8xl">
            Page not found
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-ink-muted">
            The page you opened is not available. Let us take you back to the
            cloth store, retail products, wholesale enquiry, or contact details.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary"
            >
              <FaHome className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-6 py-3 text-sm font-bold text-primary-900 transition hover:border-secondary hover:text-secondary"
            >
              <FaShoppingBag className="h-4 w-4" />
              Browse Cloths
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-lg border border-primary-100 bg-white shadow-warm">
            <div className="border-b border-primary-100 bg-primary-900 p-6 text-white">
              <div className="text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
                Find what you need
              </div>
              <h2 className="mt-2 text-2xl font-extrabold">
                Retail and wholesale cloth paths
              </h2>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-3">
              {paths.map(({ title, text, href, Icon, external }) => {
                const content = (
                  <>
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary-600 text-white transition group-hover:bg-secondary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="mt-4 block text-base font-extrabold text-primary-950">
                      {title}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-ink-muted">
                      {text}
                    </span>
                  </>
                );

                return external ? (
                  <a
                    key={title}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-lg border border-primary-100 bg-primary-50 p-4 transition hover:border-secondary hover:bg-white"
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={title}
                    href={href}
                    className="group rounded-lg border border-primary-100 bg-primary-50 p-4 transition hover:border-secondary hover:bg-white"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>

            <div className="grid gap-3 border-t border-primary-100 bg-primary-50 p-5 sm:grid-cols-3">
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary-dark"
              >
                <FaWhatsapp className="h-4 w-4" />
                Ask on WhatsApp
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-5 py-3 text-sm font-bold text-primary-900 transition hover:border-secondary hover:text-secondary"
              >
                <FaPhoneAlt className="h-4 w-4" />
                Call {siteConfig.phone}
              </a>
              <a
                href={`tel:${siteConfig.secondaryPhone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-5 py-3 text-sm font-bold text-primary-900 transition hover:border-secondary hover:text-secondary"
              >
                <FaPhoneAlt className="h-4 w-4" />
                Call {siteConfig.secondaryPhone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
