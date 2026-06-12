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
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import StatsCounter from "@/components/StatsCounter";
import TestimonialSlider from "@/components/TestimonialSlider";
import FAQAccordion from "@/components/FAQAccordion";
import OfferBanner from "@/components/OfferBanner";

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

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const wholesaleReady = products
    .filter((p) => p.stock >= 100 || p.featured)
    .slice(0, 4);

  return (
    <>
      <HeroSlider />

      {/* Buyer paths */}
      <section className="border-y border-cream-200 bg-white">
        <div className="container-x grid gap-4 py-8 lg:grid-cols-[1fr_1fr_auto] lg:items-stretch">
          {buyerPaths.map(({ title, text, href, action, Icon, ...rest }) => {
            const external = "external" in rest ? rest.external : false;
            const content = (
              <>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary-600 text-white transition group-hover:bg-secondary-dark">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-extrabold text-ink">
                    {title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-ink-muted">
                    {text}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary-600">
                    {action} <FaArrowRight className="h-3 w-3" />
                  </span>
                </span>
              </>
            );

            return external ? (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex gap-4 rounded-lg border border-cream-200 bg-cream-50 p-5 transition hover:border-primary-600 hover:bg-white"
              >
                {content}
              </a>
            ) : (
              <Link
                key={title}
                href={href}
                className="group flex gap-4 rounded-lg border border-cream-200 bg-cream-50 p-5 transition hover:border-primary-600 hover:bg-white"
              >
                {content}
              </Link>
            );
          })}

          <div className="rounded-lg border border-cream-200 bg-ink p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10">
                <FaPhoneAlt className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs text-white/60">Call store</span>
                <span className="block text-lg font-extrabold">
                  {siteConfig.phone}
                </span>
              </span>
            </div>
            <div className="mt-4 text-xs leading-5 text-white/60">
              {siteConfig.workingHours}
            </div>
          </div>
        </div>
      </section>

      {/* Intro / stats */}
      <section className="section-y bg-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-primary-600/20 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-600">
              <FaTags className="h-3 w-3 text-secondary-dark" />
              {siteConfig.address.city}, Tamil Nadu
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl">
              Cloths for homes, shops and wholesale trade.
            </h2>
            <p className="mt-5 text-base leading-7 text-ink-muted">
              {siteConfig.name} supplies practical cotton and handloom textile
              products from Erode. Retail customers can shop everyday essentials,
              while wholesale buyers can request bulk supply and repeat stock.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary rounded-lg">
                Browse Cloth Range
              </Link>
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-cream-300 bg-white px-6 py-3 text-sm font-bold text-ink transition hover:border-secondary-dark hover:text-secondary-dark"
              >
                <FaWhatsapp className="h-4 w-4" />
                Wholesale Enquiry
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <StatsCounter items={stats} />
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
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider-x text-primary-600 hover:text-secondary-dark"
            >
              All Categories <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 4).map((c, i) => (
              <CategoryCard key={c.id} category={c} index={i} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            {categories.slice(4).map((c, i) => (
              <CategoryCard key={c.id} category={c} index={i + 4} />
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale-ready products */}
      <section className="section-y bg-cream-50">
        <div className="container-x">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionTitle
              eyebrow="Wholesale Ready"
              title="Fast-moving cloths for shops"
              description="Products with practical stock, familiar demand and simple WhatsApp ordering for bulk buyers."
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary-dark"
            >
              View All Products <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-4">
            {wholesaleReady.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Offer */}
      {offers.length > 0 && (
        <section className="bg-white py-12">
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
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider-x text-primary-600 hover:text-secondary-dark"
            >
              Shop New Arrivals <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-4">
            {(newArrivals.length > 0 ? newArrivals : featured.slice(0, 4)).map(
              (p) => (
                <ProductCard key={p.id} product={p} />
              ),
            )}
          </div>
        </div>
      </section>

      {/* Order process */}
      <section className="section-y bg-ink text-white">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white/8 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-gold-light">
              <FaTruckMoving className="h-3 w-3" />
              Bulk order flow
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
              Simple buying for wholesale cloth orders.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/65">
              No complicated checkout for bulk buyers. Talk to us directly,
              confirm the requirement and get practical despatch support.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {tradeSteps.map((step, i) => (
              <div
                key={step}
                className="rounded-lg border border-white/10 bg-white/6 p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary-dark text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <FaCheckCircle className="h-4 w-4 text-gold-light" />
                </div>
                <div className="text-base font-bold leading-6 text-white">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="section-y bg-cream-50">
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
                  className="rounded-lg border border-cream-200 bg-white p-6 transition hover:border-primary-600"
                >
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-primary-600 text-white">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <h3 className="text-lg font-extrabold leading-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink-muted">
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
          <SectionTitle
            eyebrow="From yarn to packing"
            title="How our cloth is prepared"
            description="A practical textile process focused on repeatable quality for retail shelves and wholesale supply."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {manufacturingProcess.map((p) => (
              <div
                key={p.step}
                className="rounded-lg border border-cream-200 bg-cream-50 p-5"
              >
                <div className="text-3xl font-extrabold leading-none text-primary-600">
                  {p.step}
                </div>
                <h3 className="mt-5 text-base font-extrabold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-y bg-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="Buyer Proof"
              title="Customers who come back"
              description="Retail buyers, shop owners and wholesale partners trust us for practical cloths and steady response."
            />
            <Link href="/testimonials" className="btn-outline rounded-lg">
              All Reviews <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-lg border border-cream-200 bg-white p-7 shadow-soft lg:col-span-8 md:p-10">
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
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider-x text-primary-600 hover:text-secondary-dark"
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
                  className="group overflow-hidden rounded-lg border border-cream-200 bg-cream-50 transition hover:border-primary-600"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-cream-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold text-ink-muted">
                      {moment(b.publishedAt).format("MMM D, YYYY")} ·{" "}
                      {b.readTime} min read
                    </div>
                    <h3 className="mt-2 text-xl font-extrabold leading-tight text-ink group-hover:text-primary-600">
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
              <div className="rounded-lg border border-cream-200 bg-ink p-6 text-white">
                <div className="text-[10px] font-bold uppercase tracking-widest-x text-gold-light">
                  Latest Updates
                </div>
                <div className="mt-5 space-y-5">
                  {latestUpdates.map((u) => (
                    <div
                      key={u.id}
                      className="border-b border-white/10 pb-5 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-white/45">
                        <span>{u.tag}</span>
                        <span>•</span>
                        <span>{moment(u.date).fromNow()}</span>
                      </div>
                      <h4 className="mt-2 text-base font-extrabold leading-tight text-white">
                        {u.title}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-white/60">
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
      <section className="section-y bg-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow="Quick Answers"
              title="Retail and wholesale questions"
              description="Common questions about cloth categories, bulk orders, WhatsApp quotes and despatch."
            />
            <Link href="/contact" className="btn-outline rounded-lg">
              Ask Your Own
            </Link>
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion items={faqs.slice(0, 5)} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-14">
        <div className="container-x">
          <div className="grid gap-8 rounded-lg bg-primary-600 p-7 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <div className="mb-3 text-[10px] font-bold uppercase tracking-widest-x text-white/70">
                Ready to buy cloths?
              </div>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
                Message us for retail products or wholesale supply.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                Send product type, quantity and city. We will respond with
                practical options for petticoats, lungis, towels, bed sheets,
                dhotis, gamcha and handloom cloths.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-secondary"
              >
                <FaWhatsapp className="h-4 w-4" />
                Ask on WhatsApp
              </a>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-ink transition hover:text-primary-600"
              >
                Browse Cloths
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
