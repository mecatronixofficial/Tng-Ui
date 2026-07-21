import type { Metadata } from "next";
import Link from "next/link";
import {
  FaBoxes,
  FaEnvelope,
  FaQuestionCircle,
  FaStore,
  FaTags,
  FaTruckMoving,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import FAQAccordion from "@/components/FAQAccordion";
import { loadFaqs } from "@/lib/data";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Retail & Wholesale FAQ",
  description: `Answers to common retail and wholesale cloth questions for ${siteConfig.name}: products, bulk orders, delivery and support.`,
  keywords: [
    "textile FAQ",
    "wholesale cloth order questions",
    "Thangavel Textile support",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `Retail & Wholesale FAQ — ${siteConfig.name}`,
    description: `Answers to common retail and wholesale cloth questions for ${siteConfig.name}: products, bulk orders, delivery and support.`,
    url: "/faq",
    type: "website",
  },
};

const helpCards = [
  { label: "Retail orders", text: "Single-piece and family cloth shopping.", Icon: FaStore },
  { label: "Wholesale supply", text: "Bulk orders for shops and traders.", Icon: FaBoxes },
  { label: "Despatch", text: "Packing, transport and delivery support.", Icon: FaTruckMoving },
];

export default async function FAQPage() {
  const faqs = await loadFaqs();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        eyebrow="Cloth buyer help"
        title="Retail and wholesale questions answered."
        subtitle="Quick answers about cloth categories, bulk orders, WhatsApp enquiries, delivery and returns."
        bgImage="https://images.unsplash.com/photo-1583846552345-d2ce05fbe1c5?w=1920&auto=format&fit=crop&q=80"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <section className="border-b border-primary-100 bg-white">
        <div className="container-x grid gap-3 py-6 md:grid-cols-3">
          {helpCards.map(({ label, text, Icon }) => (
            <div
              key={label}
              className="rounded-lg border border-primary-100 bg-primary-50 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-extrabold text-primary-950">
                    {label}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-ink-muted">
                    {text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionTitle
                eyebrow="Buyer support"
                title="Find answers before you order."
              />

              <div className="space-y-5">
                <div className="rounded-lg border border-primary-100 bg-white p-6 shadow-soft">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-50 text-secondary">
                    <FaQuestionCircle className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold text-primary-950">
                    {faqs.length} answered
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    Covering product selection, wholesale, retail, despatch and support.
                  </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-secondary/30 bg-primary-900 text-white shadow-warm">
                  <div className="p-6">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
                      <FaTags className="h-3 w-3" />
                      Live cloth help
                    </div>
                    <h3 className="mt-4 text-2xl font-extrabold leading-tight">
                      Need current stock or wholesale support?
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Send product type, quantity and city. We will reply with
                      available options.
                    </p>
                    <div className="mt-5 flex flex-col gap-3">
                      <a
                        href={siteConfig.socials.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary-dark"
                      >
                        <FaWhatsapp className="h-4 w-4" /> WhatsApp
                      </a>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-primary-900"
                      >
                        <FaEnvelope className="h-4 w-4" /> Email Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <FAQAccordion items={faqs} />

            <div className="mt-10 rounded-lg border border-dashed border-secondary/40 bg-white p-8 text-center shadow-soft">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-primary-50 text-secondary">
                <FaWhatsapp className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-primary-950">
                Still looking for a cloth answer?
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
                Contact our team for retail product support, wholesale supply,
                delivery details or category-specific availability.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary-dark"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-primary-200 bg-white px-5 py-3 text-sm font-bold text-primary-800 transition hover:border-secondary hover:text-secondary"
                >
                  Contact Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
