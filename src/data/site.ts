const rawWhatsappNumber = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94862 73862"
).replace(/\D/g, "");
const whatsappNumber =
  rawWhatsappNumber.length === 10
    ? `91${rawWhatsappNumber}`
    : rawWhatsappNumber;

export const siteConfig = {
  logo: "",
  name: "Thangavel Textile",
  tagline: "Woven in Erode. Worn across India.",
  description:
    "Thangavel Textile — a leading textile manufacturer and wholesaler from Erode, Tamil Nadu. Specialists in petticoats, lungis, towels, gamcha, bed sheets, dhotis and handloom products.",
  ceo: "Thangavel",
  established: "1999",
  gstSince: "Jul 2017",
  legalStatus: "Proprietorship",
  natureOfBusiness: "Manufacturer",
  additionalBusiness: [
    "Wholesale Business",
    "Retail Business",
    "Factory / Manufacturing",
  ],
  address: {
    line1: "Thangavel Textile",
    line2: "53, Sengoda Street, Erode Fort",
    city: "Erode",
    state: "Tamil Nadu",
    country: "India",
    pincode: "638001",
  },
  ownerPhoto:
    "https://res.cloudinary.com/dtbjt4hvf/image/upload/v1782368406/c6b31125-7a39-4fdd-aba4-fb114116034b_beh2tp.png",
  locationlink:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500719.3869732372!2d77.11703358906247!3d11.344189399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f76701221ad%3A0xdd9e9ade36b41375!2sThangavel%20Textile%20-%20Inskirts%20Wholesaler!5e0!3m2!1sen!2sin!4v1782230759309!5m2!1sen!2sin",
  phone: "+91 9443454628",
  whatsapp: whatsappNumber,
  email: "thangaveltextile99@gmail.com",
  workingHours: "Mon – Sat: 9:00 AM – 8:00 PM",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    whatsapp: `https://wa.me/${whatsappNumber}`,
  },
  office: {
    workplace1:
      "https://res.cloudinary.com/dtbjt4hvf/image/upload/v1783403876/DSC09656_jw1zlp.jpg",
    workplace2:
      "https://res.cloudinary.com/dtbjt4hvf/image/upload/v1783404177/DSC09619_uk3sxd.jpg",
    workplace3:
      "https://res.cloudinary.com/dtbjt4hvf/image/upload/v1783404293/DSC09615_zd1xrg.jpg",
    workplace4:
      "https://res.cloudinary.com/dtbjt4hvf/image/upload/v1783405030/DSC09659_jmdxc1.jpg",
    workplace5:
      "https://res.cloudinary.com/dtbjt4hvf/image/upload/v1783405030/DSC09659_jmdxc1.jpg",
    workplace6:
      "https://res.cloudinary.com/dtbjt4hvf/image/upload/v1782368406/c6b31125-7a39-4fdd-aba4-fb114116034b_beh2tp.png",
  },
};

export const stats = [
  { value: 25, suffix: "+", label: "Years of Manufacturing" },
  { value: 500, suffix: "+", label: "Wholesale Partners" },
  { value: 50000, suffix: "+", label: "Meters of Fabric Woven Monthly" },
  { value: 7, suffix: "", label: "Core Product Categories" },
];

export const whyChooseUs = [
  {
    icon: "FaIndustry",
    title: "Erode-based Manufacturing",
    description:
      "Every meter is woven and finished in our Erode facility — the heart of Tamil Nadu's textile heritage.",
  },
  {
    icon: "FaTshirt",
    title: "Premium Cotton & Handloom",
    description:
      "Sourced directly from trusted spinning mills and skilled handloom weavers across the region.",
  },
  {
    icon: "FaWeight",
    title: "Consistent GSM & Quality",
    description:
      "Strict GSM standards and multi-stage quality checks ensure every roll meets the same benchmark.",
  },
  {
    icon: "FaHandshake",
    title: "Wholesale & Retail Ready",
    description:
      "From single-piece retail to bulk wholesale orders — we deliver with the same care and timeline.",
  },
  {
    icon: "FaShippingFast",
    title: "Pan-India Despatch",
    description:
      "Reliable logistics partnerships ensure your order reaches every corner of India on time.",
  },
  {
    icon: "FaLeaf",
    title: "Honest, Long-Standing Trade",
    description:
      "GST-registered since 2017, run by hand, not by hype — a partnership you can build a business on.",
  },
];

export const manufacturingProcess = [
  {
    step: "01",
    title: "Yarn Selection",
    description:
      "Premium cotton yarn sourced from regional spinning mills, graded for fineness and strength.",
  },
  {
    step: "02",
    title: "Weaving",
    description:
      "Powerloom and skilled handloom weaving — each technique chosen to suit the end product.",
  },
  {
    step: "03",
    title: "Dyeing & Finishing",
    description:
      "Colour-fast dyeing, calendering and softening to deliver the feel customers come back for.",
  },
  {
    step: "04",
    title: "Quality Control",
    description:
      "Every roll inspected for GSM, weave density, colour bleed and finish before despatch.",
  },
  {
    step: "05",
    title: "Packing & Despatch",
    description:
      "Sorted, labelled and packed to wholesale or retail standards, ready for pan-India shipping.",
  },
];

export const latestUpdates = [
  {
    id: "u1",
    title: "Festival Collection — Diwali drop is live",
    excerpt:
      "Cotton dhotis, premium bed sheets and bright gamcha range now in stock for festival orders.",
    date: "2026-05-10T09:00:00Z",
    tag: "Collection",
  },
  {
    id: "u2",
    title: "Bulk wholesale enquiry channel on WhatsApp",
    excerpt:
      "Faster quotes for wholesale customers — share your requirement and we'll respond within hours.",
    date: "2026-04-22T11:30:00Z",
    tag: "Service",
  },
  {
    id: "u3",
    title: "New handloom lungi range from local weavers",
    excerpt:
      "Partnered with three new handloom cooperatives to expand our authentic Erode lungi range.",
    date: "2026-03-15T10:00:00Z",
    tag: "Product",
  },
];
