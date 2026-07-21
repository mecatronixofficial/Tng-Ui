import { siteConfig } from "@/data/site";

interface OrderParams {
  productName: string;
  productLink?: string;
  color?: string;
  size?: string;
  quantity?: number | string;
}

export function buildWhatsAppOrderUrl({
  productName,
  productLink,
  color,
  size,
  quantity,
}: OrderParams): string {
  const lines = [
    `Hello ${siteConfig.name},`,
    "",
    "I want to order the following product:",
    "",
    `Product Name: ${productName}`,
  ];
  if (color) lines.push(`Color: ${color}`);
  if (size) lines.push(`Size: ${size}`);
  if (quantity) lines.push(`Quantity: ${quantity}`);
  if (productLink) lines.push(`Product Link: ${productLink}`);
  lines.push("", "Please share availability details.");

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${siteConfig.whatsapp}?text=${message}`;
}

interface CartOrderItem {
  productName: string;
  productLink?: string;
  color?: string;
  size?: string;
  quantityLabel: string;
}

export function buildWhatsAppCartUrl(items: CartOrderItem[]): string {
  const lines = [
    `Hello ${siteConfig.name},`,
    "",
    `I want to order the following ${items.length} product${items.length > 1 ? "s" : ""}:`,
  ];
  items.forEach((item, index) => {
    lines.push("", `${index + 1}. ${item.productName}`);
    if (item.color) lines.push(`   Color: ${item.color}`);
    if (item.size) lines.push(`   Size: ${item.size}`);
    lines.push(`   Quantity: ${item.quantityLabel}`);
    if (item.productLink) lines.push(`   Link: ${item.productLink}`);
  });
  lines.push("", "Please share availability details.");

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${siteConfig.whatsapp}?text=${message}`;
}

export function buildWhatsAppEnquiryUrl(message?: string): string {
  const defaultMsg = `Hello ${siteConfig.name}, I'd like to enquire about your products.`;
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    message || defaultMsg
  )}`;
}
