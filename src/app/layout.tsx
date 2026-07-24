import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollToTop from "@/components/ScrollToTop";
import OpeningSpecialCard from "@/components/OpeningSpecialCard";
import { siteConfig } from "@/data/site";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const ogImage =
  "/banners/a-picturesque-arrangement-of-cotton-fabric-in-a-rainbow-of-colors-with-expansive-copy-space-perfect-for-use-in-textile-industry-catalogs-or-creative-arts-flyers-free-photo.jpg";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thangaveltextile.com"),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "textile manufacturer Erode",
    "cotton petticoat",
    "lungi manufacturer",
    "wholesale textile India",
    "handloom lungi",
    "cotton bed sheets",
    "Tamil Nadu textiles",
    "cotton dhoti",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    url: "/",
    images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/logo/tng logo.jpeg",
    shortcut: "/logo/tng logo.jpeg",
    apple: "/logo/tng logo.jpeg",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": "https://www.thangaveltextile.com/#organization",
  name: siteConfig.name,
  description: siteConfig.description,
  url: "https://www.thangaveltextile.com",
  logo: "https://www.thangaveltextile.com/logo/tng%20logo.jpeg",
  image: "https://www.thangaveltextile.com/logo/tng%20logo.jpeg",
  telephone: siteConfig.phone,
  email: siteConfig.email,
  foundingDate: siteConfig.established,
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.pincode,
    addressCountry: "IN",
  },
  openingHours: "Mo-Sa 09:00-20:00",
  sameAs: [
    siteConfig.socials.facebook,
    siteConfig.socials.instagram,
    siteConfig.socials.youtube,
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.thangaveltextile.com/#website",
  name: siteConfig.name,
  url: "https://www.thangaveltextile.com",
  publisher: { "@id": "https://www.thangaveltextile.com/#organization" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans bg-cream-50 text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <ScrollToTop />
        <OpeningSpecialCard />
      </body>
    </html>
  );
}
