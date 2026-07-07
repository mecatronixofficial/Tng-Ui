import Link from "next/link";
import moment from "moment";
import {
  FaArrowRight,
  FaWhatsapp,
  FaIndustry,
  FaLeaf,
  FaHandshake,
  FaShippingFast,
  FaTshirt,
  FaWeight,
  FaStore,
  FaBoxes,
  FaTruckMoving,
  FaPhoneAlt,
  FaTags,
  FaCheckCircle,
} from "react-icons/fa";

import HeroSlider from "@/components/HeroSlider";
import SectionTitle from "@/components/SectionTitle";
import CategorySlider from "@/components/CategorySlider";
import CollapsibleProductGrid from "@/components/CollapsibleProductGrid";
import StatsCounter from "@/components/StatsCounter";
import TestimonialSlider from "@/components/TestimonialSlider";
import FAQAccordion from "@/components/FAQAccordion";
import OfferBanner from "@/components/OfferBanner";
import ContactForm from "@/components/ContactForm";

import {
  loadCategories,
  loadProducts,
  loadBlogs,
  loadTestimonials,
  loadOffers,
  loadFaqs,
} from "@/lib/data";
import {
  siteConfig,
  stats,
  whyChooseUs,
  manufacturingProcess,
  latestUpdates,
} from "@/data/site";

const iconMap = {
  FaIndustry,
  FaTshirt,
  FaWeight,
  FaHandshake,
  FaShippingFast,
  FaLeaf,
};

const buyerPaths = [
  {
    title: "Retail Cloth Shopping",
    text: "Buy single pieces, family-use cloths, daily wear and festival essentials.",
    href: "/products",
    action: "Shop retail",
    Icon: FaStore,
  },
  {
    title: "Wholesale Cloth Supply",
    text: "Get bulk supply for shops, traders, resellers, boutiques and institutions.",
    href: siteConfig.socials.whatsapp,
    action: "Send bulk enquiry",
    Icon: FaBoxes,
    external: true,
  },
] as const;

const tradeSteps = [
  "Share cloth type, quantity and delivery city",
  "Receive product options and availability",
  "Confirm packing, colour and size requirement",
  "We prepare and despatch your order",
];

function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default async function HomePage() {
  const [categories, products, blogPosts, testimonials, offers, faqs] =
    await Promise.all([
      loadCategories(),
      loadProducts(),
      loadBlogs(),
      loadTestimonials(),
      loadOffers(),
      loadFaqs(),
    ]);

  const featured = shuffleItems(products.filter((p) => p.featured)).slice(0, 8);
  const newArrivals = shuffleItems(products.filter((p) => p.newArrival)).slice(
    0,
    8,
  );
  const wholesaleReady = shuffleItems(
    products.filter((p) => p.stock >= 100 || p.featured),
  ).slice(0, 8);
  const homeOfficeImages = [
    siteConfig.office.workplace1,
    siteConfig.office.workplace2,
    siteConfig.office.workplace3,
  ];
  const introImage = homeOfficeImages[0];

  return (
    <>
      <HeroSlider />

      {/* Buyer paths */}
      <section className="border-y border-primary-100 bg-white py-12">
        <div className="container-x">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-600">
              <FaStore className="h-3 w-3 text-primary-500" />
              How would you like to buy?
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-stretch">
            {buyerPaths.map(({ title, text, href, action, Icon, ...rest }) => {
              const external = "external" in rest ? rest.external : false;
              const isWholesale = external;
              const iconCls = isWholesale
                ? "bg-[#25D366]/10 text-[#128C7E]"
                : "bg-primary-50 text-primary-600";
              const badge = isWholesale ? "B2B · Bulk orders" : "B2C · Retail";

              const content = (
                <div className="flex gap-4">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${iconCls}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary-400">
                      {badge}
                    </span>
                    <span className="block text-lg font-bold text-ink">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-ink-muted">
                      {text}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary-600">
                      {action}
                      <FaArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              );

              return external ? (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-primary-100 bg-white p-6 transition hover:border-primary-300"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={title}
                  href={href}
                  className="rounded-2xl border border-primary-100 bg-white p-6 transition hover:border-primary-300"
                >
                  {content}
                </Link>
              );
            })}

            <div className="rounded-2xl border border-primary-100 bg-primary-950 p-6 text-white">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary/15 text-secondary">
                  <FaPhoneAlt className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-white/50">
                    Call store directly
                  </span>
                  <span className="block text-lg font-bold">
                    {siteConfig.phone}
                  </span>
                </div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-3 text-xs leading-5 text-white/55">
                {siteConfig.workingHours}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Intro / stats */}
     <section className="relative overflow-hidden bg-primary-950 py-16 text-white md:py-24">
  <div className="absolute inset-0 bg-weave-dark opacity-30" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_16%_20%,rgba(255,214,51,0.14),transparent_48%),radial-gradient(ellipse_80%_70%_at_84%_10%,rgba(66,133,252,0.22),transparent_52%)]" />
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent" />

  <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-stretch">
    {/* LEFT CONTENT */}
    <div className="relative flex h-full flex-col justify-center lg:col-span-5">
      <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest-x text-secondary-light shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <FaTags className="h-3 w-3" />
        Est. {siteConfig.established} · {siteConfig.address.city}, Tamil Nadu
      </div>

      <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
        {siteConfig.tagline}
      </h2>

      <p className="mt-5 text-base leading-7 text-white/65">
        {siteConfig.description}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          "Inskirt, Nighty, Lungi",
          "Dhotis & Towels",
          `GST registered since ${siteConfig.gstSince}`,
          "Pan-India despatch",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-semibold text-white/80"
          >
            <FaCheckCircle className="h-3.5 w-3.5 shrink-0 text-secondary-light" />
            {item}
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-black text-primary-950 shadow-[0_16px_40px_-20px_rgba(255,214,51,0.8)] transition hover:-translate-y-0.5 hover:bg-secondary-light"
        >
          Browse Cloth Range <FaArrowRight className="h-3.5 w-3.5" />
        </Link>

        <a
          href={siteConfig.socials.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-6 py-3 text-sm font-bold text-white/90 shadow-soft backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-white"
        >
          <FaWhatsapp className="h-4 w-4" />
          Wholesale Enquiry
        </a>
      </div>
    </div>

    {/* RIGHT CONTENT */}
    <div className="relative flex h-full flex-col gap-5 lg:col-span-7">
      <div className="absolute -inset-4 rounded-[2rem]" />

      <div className="relative flex flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_24px_80px_-44px_rgba(0,0,0,0.85)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={introImage}
          alt={`${siteConfig.name} textile products`}
          className="min-h-[260px] w-full object-cover sm:min-h-[340px] lg:min-h-[420px]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/10 to-transparent" />

        <div className="absolute bottom-5 left-5 right-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-primary-950/65 px-4 py-2 text-[10px] font-black uppercase tracking-widest-x text-white/85 backdrop-blur">
            <FaCheckCircle className="h-3 w-3 text-secondary-light" />
            Retail and wholesale cloth supply
          </div>
        </div>
      </div>

      <div className="relative">
        <StatsCounter items={stats} light />
      </div>
    </div>
  </div>
</section>

      {/* Categories */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              eyebrow="Cloth Range"
              title="Shop by product type"
              description="Retail and wholesale-ready categories for daily wear, home use, festivals, shop stock and repeat trade."
            />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300 hover:text-primary-900"
              >
                All Categories <FaArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300 hover:text-primary-900"
              >
                All Products <FaArrowRight className="h-3 w-3" />
              </Link>
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-ink transition hover:border-primary-300"
              >
                <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
                Wholesale
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-100 p-3 md:p-5">
            <CategorySlider categories={categories.slice(-5)} />
          </div>

          <div className="mt-8 grid gap-6 overflow-hidden rounded-2xl border border-primary-100 bg-primary-950 p-4 text-white lg:grid-cols-12 lg:items-center lg:p-6">
            <div className="overflow-hidden rounded-xl bg-primary-900 lg:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={homeOfficeImages[1]}
                alt={`${siteConfig.name} office and textile display`}
                className="h-[220px] w-full object-cover sm:h-[280px] lg:h-[320px]"
              />
            </div>
            <div className="lg:col-span-7 lg:pl-4">
              <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
                <FaStore className="h-3 w-3" />
                In-store selection
              </div>
              <h3 className="max-w-2xl text-2xl font-extrabold leading-tight text-white md:text-3xl">
                Cloth ranges arranged for easy retail and wholesale buying.
              </h3>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/65">
                Visit, compare, confirm quantities and discuss repeat supply
                directly with our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale-ready products */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionTitle
              eyebrow="Wholesale Ready"
              title="Fast-moving cloths for shops"
              description="Products with practical stock, familiar demand and simple WhatsApp ordering for bulk buyers."
            />
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300 hover:text-primary-900"
            >
              View All Products <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <CollapsibleProductGrid
            products={wholesaleReady}
            showLabel="Show Wholesale Products"
            hideLabel="Hide Wholesale Products"
          />
        </div>
      </section>

      {/* Offer */}
      {offers.length > 0 && (
        <section className="bg-gradient-to-b from-white to-primary-50/60 py-12">
          <div className="container-x">
            <OfferBanner offer={offers[0]} />
          </div>
        </section>
      )}

      {/* Retail arrivals */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              eyebrow="Retail Picks"
              title="New arrivals for everyday use"
              description="Fresh cloth selections for retail customers, family shopping and seasonal needs."
            />
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300 hover:text-primary-900"
            >
              Shop New Arrivals <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <CollapsibleProductGrid
            products={newArrivals.length > 0 ? newArrivals : featured}
            showLabel="Show New Arrivals"
            hideLabel="Hide New Arrivals"
          />
        </div>
      </section>

      {/* Order process */}
      <section className="section-y bg-primary-950 text-white">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-secondary">
              <FaTruckMoving className="h-3 w-3" />
              Bulk order flow
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white">
              Simple buying for wholesale cloth orders.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              No complicated checkout for bulk buyers. Talk to us directly,
              confirm the requirement and get practical despatch support.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {tradeSteps.map((step, i) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 p-5 transition hover:border-white/20"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-sm font-bold text-secondary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <FaCheckCircle className="h-3.5 w-3.5 text-white/30" />
                </div>
                <div className="text-base font-semibold leading-6 text-white/90">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionTitle
            eyebrow={`Why ${siteConfig.name}`}
            title="Retail care. Wholesale discipline."
            description="The same product quality, packing attention and response speed whether you buy one piece or one carton."
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

      {/* Manufacturing process */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionTitle
                eyebrow="From yarn to packing"
                title="How our cloth is prepared"
                description="A practical textile process focused on repeatable quality for retail shelves and wholesale supply."
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-primary-100 bg-primary-50 lg:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={homeOfficeImages[2]}
                alt={`${siteConfig.name} packing and despatch area`}
                className="h-[220px] w-full object-cover md:h-[260px]"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {manufacturingProcess.map((p) => (
              <div
                key={p.step}
                className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300"
              >
                <div className="text-3xl font-bold leading-none text-primary-500">
                  {p.step}
                </div>
                <h3 className="mt-4 text-base font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-y bg-gradient-to-b from-primary-50/70 to-white">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="Buyer Proof"
              title="Customers who come back"
              description="Retail buyers, shop owners and wholesale partners trust us for practical cloths and steady response."
            />
            <Link
              href="/testimonials"
              className="btn-outline rounded-xl bg-white shadow-soft"
            >
              All Reviews <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white p-7 shadow-[0_18px_60px_-34px_rgba(4,14,48,0.55)] lg:col-span-8 md:p-10">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
            <TestimonialSlider items={testimonials.slice(0, 4)} />
          </div>
        </div>
      </section>

      {/* Articles and updates */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              eyebrow="Trade Notes"
              title="Cloth updates and buying guides"
              description="Useful product notes, care advice and stock updates for retail and wholesale customers."
            />
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300 hover:text-primary-900"
            >
              All Articles <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
              {blogPosts.slice(0, 2).map((b) => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="group overflow-hidden rounded-2xl border border-primary-100 bg-white transition hover:border-primary-300"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-primary-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-ink-muted">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">
                        Blog
                      </span>
                      <span>{moment(b.publishedAt).format("MMM D, YYYY")}</span>
                      <span>·</span>
                      <span>{b.readTime} min read</span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-primary-950 group-hover:text-primary-700">
                      {b.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">
                      {b.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="rounded-2xl border border-primary-100 p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest-x text-primary-500">
                  Latest Updates
                </div>
                <div className="mt-5 space-y-5">
                  {latestUpdates.map((u) => (
                    <div
                      key={u.id}
                      className="border-b border-primary-100 pb-5 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-secondary-dark">
                          {u.tag}
                        </span>
                        <span className="text-[10px] text-ink-muted">
                          {moment(u.date).fromNow()}
                        </span>
                      </div>
                      <h4 className="mt-2 text-base font-bold leading-tight text-primary-950">
                        {u.title}
                      </h4>
                      <p className="mt-1.5 text-sm leading-6 text-ink-muted">
                        {u.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y bg-gradient-to-b from-primary-50/70 to-white">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="Quick Answers"
              title="Retail and wholesale questions"
              description="Common questions about cloth categories, bulk orders, WhatsApp quotes and despatch."
            />
            <Link
              href="/contact"
              className="btn-outline rounded-xl bg-white shadow-soft"
            >
              Ask Your Own
            </Link>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white p-4 shadow-[0_18px_60px_-34px_rgba(4,14,48,0.55)] lg:col-span-8 md:p-6">
            <FAQAccordion items={faqs.slice(0, 5)} />
          </div>
        </div>
      </section>
    </>
  );
}
