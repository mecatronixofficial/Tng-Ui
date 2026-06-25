import type { Metadata } from "next";
import {
  FaBoxes,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStore,
  FaTags,
  FaTruckMoving,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${siteConfig.name} for retail cloth shopping, wholesale textile supply, bulk orders and store enquiries in ${siteConfig.address.city}.`,
};

const whatsappNumber = siteConfig.whatsapp.replace(/\D/g, "");
const contactWhatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  [
    `Hello ${siteConfig.name},`,
    "",
    "I want to enquire about your textile products.",
    "",
    "Requirement:",
    "Product:",
    "Quantity:",
    "Size:",
    "Color:",
    "City:",
    "",
    "Please share availability and price details.",
  ].join("\n"),
)}`;

const contactTiles = [
  {
    Icon: FaMapMarkerAlt,
    label: "Visit Cloth Store",
    title: siteConfig.address.line2,
    text: `${siteConfig.address.city}, ${siteConfig.address.state} - ${siteConfig.address.pincode}`,
  },
  {
    Icon: FaWhatsapp,
    label: "Wholesale WhatsApp",
    title: "Send bulk enquiry",
    text: siteConfig.phone,
    href: contactWhatsappHref,
  },
  {
    Icon: FaPhoneAlt,
    label: "Retail Phone Enquiry",
    title: siteConfig.phone,
    text: "Call before visiting",
    href: `tel:${siteConfig.phone.replace(/\s+/g, "")}`,
  },
  {
    Icon: FaClock,
    label: "Working Hours",
    title: siteConfig.workingHours,
    text: "Retail and wholesale support",
  },
];

const enquiryHelp = [
  "Product type: petticoat, lungi, towel, bed sheet, dhoti, gamcha or handloom",
  "Size or fit: free size, S-XXL, bed size, dhoti length or mixed sizes",
  "Color or design: plain, printed, checked, border color or mixed colors",
  "Quantity, packing, bundle count and delivery city",
  "Fabric, GSM, GST invoice or repeat shop stock requirement",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact cloth store"
        title="Retail shopping and wholesale cloth enquiries."
        subtitle="Message us for product availability, shop supply, despatch support or visit details."
        bgImage="https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=1920&auto=format&fit=crop&q=80"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* Contact paths */}
      <section className="section-y bg-cream-50">
        <div className="container-x">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionTitle
              eyebrow="Reach us"
              title="Choose the fastest way to contact us."
              description="For wholesale enquiries, WhatsApp is quickest. For retail visits or product questions, call or send the form below."
            />
            <a
              href={contactWhatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
            >
              <FaWhatsapp className="h-4 w-4" />
              Ask cloth details
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactTiles.map(({ Icon, label, title, text, href }) => {
              const inner = (
                <div className="group h-full rounded-lg border border-primary-100 bg-white p-5 shadow-soft transition hover:border-secondary hover:shadow-warm">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-white transition group-hover:bg-secondary-dark">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-4 text-[10px] font-bold uppercase tracking-widest-x text-secondary">
                    {label}
                  </div>
                  <div className="mt-2 text-base font-extrabold leading-snug text-primary-950">
                    {title}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-ink-muted">
                    {text}
                  </div>
                </div>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                >
                  {inner}
                </a>
              ) : (
                <div key={label}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionTitle
            eyebrow="Send enquiry"
            title="Tell us your cloth requirement."
            description="Let us know if your requirement is for retail or wholesale supply. Please include product type, size, color, quantity, packing, delivery location and any fabric or GSM preferences."
            align="center"
          />

          <div className="mt-4 grid gap-8 lg:grid-cols-12">
            <div className="rounded-lg border border-primary-100 bg-white p-5 shadow-soft lg:col-span-7 md:p-7">
              <ContactForm />
            </div>

            <aside className="space-y-6 lg:col-span-5">
              <div className="overflow-hidden rounded-lg border border-secondary/30 bg-primary-900 text-white shadow-warm">
                <div className="border-b border-white/10 p-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
                    Direct cloth enquiry
                  </div>
                  <h3 className="mt-2 text-2xl font-extrabold">
                    WhatsApp us for retail and wholesale support.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Send product name, size, color, quantity and city. We will
                    reply with availability details.
                  </p>
                </div>

                <div className="grid gap-3 p-5">
                  <a
                    href={contactWhatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 rounded-lg bg-secondary px-5 py-4 text-white transition hover:bg-secondary-dark"
                  >
                    <FaWhatsapp className="h-6 w-6" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider-x text-white/80">
                        WhatsApp
                      </div>
                      <div className="font-extrabold">{siteConfig.phone}</div>
                    </div>
                  </a>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-4 rounded-lg bg-white/8 px-5 py-4 transition hover:bg-white/12"
                  >
                    <FaPhoneAlt className="h-5 w-5 text-secondary-light" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider-x text-white/60">
                        Phone
                      </div>
                      <div className="font-extrabold">{siteConfig.phone}</div>
                    </div>
                  </a>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-4 rounded-lg bg-white/8 px-5 py-4 transition hover:bg-white/12"
                  >
                    <FaEnvelope className="h-5 w-5 text-secondary-light" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider-x text-white/60">
                        Email
                      </div>
                      <div className="font-extrabold">{siteConfig.email}</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="rounded-lg border border-primary-100 bg-primary-50 p-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800 shadow-soft">
                  <FaTags className="h-3 w-3 text-secondary" />
                  Include these details
                </div>
                <div className="space-y-3">
                  {enquiryHelp.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-lg bg-white p-3 text-sm font-semibold leading-6 text-ink-soft shadow-soft"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-primary-100 bg-white p-6 shadow-soft">
                <h3 className="text-xl font-extrabold text-primary-950">
                  Follow our cloth updates
                </h3>
                <div className="mt-5 flex items-center gap-3">
                  {[
                    {
                      href: siteConfig.socials.facebook,
                      Icon: FaFacebookF,
                      label: "Facebook",
                    },
                    {
                      href: siteConfig.socials.instagram,
                      Icon: FaInstagram,
                      label: "Instagram",
                    },
                    {
                      href: siteConfig.socials.youtube,
                      Icon: FaYoutube,
                      label: "YouTube",
                    },
                  ].map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-lg border border-primary-100 bg-primary-50 text-primary-800 transition hover:border-secondary hover:bg-secondary hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Visit and map */}
      <section className="section-y bg-cream-50">
        <div className="container-x">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionTitle
              eyebrow="Find us"
              title={`Visit our cloth business in ${siteConfig.address.city}.`}
              description="Conveniently located in the heart of Erode's textile market, our showroom serves both retail and wholesale customers. Please contact us before visiting to confirm product availability, discuss bulk orders, or schedule a business meeting."
            />
            <div className="grid gap-2 rounded-lg border border-primary-100 bg-white p-4 shadow-soft sm:min-w-[280px]">
              <div className="flex items-center gap-3 text-sm font-bold text-primary-950">
                <FaStore className="h-4 w-4 text-secondary" />
                Retail counter support
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-primary-950">
                <FaBoxes className="h-4 w-4 text-secondary" />
                Wholesale order discussion
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-primary-950">
                <FaTruckMoving className="h-4 w-4 text-secondary" />
                Despatch coordination
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-primary-100 bg-white p-2 shadow-warm">
            <iframe
              title="S. Thangavel Textiles Location"
              src={siteConfig.locationlink}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
