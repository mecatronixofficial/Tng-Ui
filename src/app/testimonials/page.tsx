import type { Metadata } from "next";
import {
  FaBoxes,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaShoppingBag,
  FaStar,
  FaStore,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import TestimonialSlider from "@/components/TestimonialSlider";
import SectionTitle from "@/components/SectionTitle";
import WriteReviewForm from "@/components/WriteReviewForm";
import { siteConfig } from "@/data/site";
import { loadTestimonials } from "@/lib/data";
import { cn } from "@/utils";

const banner = "/banners/WhatsApp%20Image%202026-07-21%20at%2023.49.14.jpeg";

export const metadata: Metadata = {
  title: "Retail & Wholesale Customer Reviews",
  description: `Retail and wholesale cloth buyer reviews for ${siteConfig.name}, including shop owners, traders and family customers.`,
  keywords: [
    "Thangavel Textile reviews",
    "wholesale cloth buyer feedback",
    "textile customer testimonials",
  ],
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: `Customer Reviews — ${siteConfig.name}`,
    description: `Retail and wholesale cloth buyer reviews for ${siteConfig.name}, including shop owners, traders and family customers.`,
    url: "/testimonials",
    type: "website",
    images: [{ url: banner, width: 1200, height: 630, alt: `${siteConfig.name} customer reviews` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Customer Reviews — ${siteConfig.name}`,
    description: `Retail and wholesale cloth buyer reviews for ${siteConfig.name}, including shop owners, traders and family customers.`,
    images: [banner],
  },
};

const proofPoints = [
  { label: "Retail customers", Icon: FaStore },
  { label: "Wholesale buyers", Icon: FaBoxes },
  { label: "Verified reviews", Icon: FaCheckCircle },
];

export default async function TestimonialsPage() {
  const testimonials = await loadTestimonials();

  const avgRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 0;

  const reviewsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": "https://www.thangaveltextile.com/#organization",
    name: siteConfig.name,
    ...(testimonials.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: testimonials.length,
      },
      review: testimonials.slice(0, 20).map((t) => ({
        "@type": "Review",
        author: { "@type": "Person", name: t.name },
        reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
        reviewBody: t.review,
      })),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
      />
      <PageHero
        eyebrow="Buyer reviews"
        title="Retail and wholesale cloth buyers speak."
        subtitle="Real feedback from families, shop owners, resellers and textile trade customers we have served."
        bgImage={banner}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
      />

      <section className="border-b border-primary-100 bg-white">
        <div className="container-x grid gap-3 py-6 md:grid-cols-3">
          {proofPoints.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-primary-100 bg-primary-50 p-4"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-white">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-extrabold text-primary-950">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured slider */}
      <section className="section-y bg-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="Featured buyer proof"
              title="Trusted by retail homes and wholesale shops."
            />
            <div className="rounded-lg border border-primary-100 bg-white p-5 shadow-soft">
              <div className="flex items-center gap-1 text-secondary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="h-5 w-5" />
                ))}
              </div>
              <div className="mt-3 text-2xl font-extrabold text-primary-950">
                4.8 avg rating
              </div>
              <div className="mt-1 text-sm font-semibold text-ink-muted">
                {testimonials.length} approved customer reviews
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <TestimonialSlider items={testimonials} />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionTitle
            eyebrow="All reviews"
            title="What cloth customers say"
            align="center"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={cn(
                  "relative rounded-lg border border-primary-100 bg-white p-6 shadow-soft transition hover:border-secondary hover:shadow-warm",
                  i % 3 === 1 ? "md:mt-8" : "",
                )}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-white">
                    <FaQuoteLeft className="h-4 w-4" />
                  </div>
                  {t.productPurchased && (
                    <div className="inline-flex max-w-[160px] items-center gap-1.5 truncate rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-800">
                      <FaShoppingBag className="h-3 w-3 text-secondary" />
                      <span className="truncate">{t.productPurchased}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4 flex items-center gap-1 text-secondary">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <FaStar
                      key={j}
                      className={cn(
                        "h-3.5 w-3.5",
                        j < Math.floor(t.rating)
                          ? "text-secondary"
                          : "text-primary-100",
                      )}
                    />
                  ))}
                </div>

                <p className="text-sm leading-7 text-ink-soft">
                  &ldquo;{t.review}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-primary-100 pt-5">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-lg font-extrabold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-ink">
                      {t.name}
                    </div>
                    <div className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider-x text-ink-muted">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </div>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-800">
                  <FaMapMarkerAlt className="h-3.5 w-3.5 text-secondary" />
                  {t.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Write a Review */}
      <section className="section-y bg-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="Your review"
              title="Bought cloth from us?"
            />
            <div className="space-y-3">
              {[
                "Reviews are verified before publishing.",
                "Retail and wholesale buyers can both submit.",
                "Mention product name for better buyer context.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-lg border border-primary-100 bg-white p-3 text-sm font-semibold leading-6 text-ink-soft shadow-soft"
                >
                  <FaCheckCircle className="mt-1 h-4 w-4 shrink-0 text-secondary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8">
            <WriteReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
