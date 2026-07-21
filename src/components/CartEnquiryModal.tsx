"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBoxes, FaSpinner, FaStore, FaTimes, FaWhatsapp } from "react-icons/fa";

import { api } from "@/lib/api";
import { buildWhatsAppCartUrl } from "@/lib/whatsapp";
import type { CartItem } from "@/store";

interface CartEnquiryModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onSubmitted: () => void;
}

function quantityLabel(item: CartItem) {
  if (item.mode === "wholesale") {
    const pieces = item.quantity * (item.bundleSize || 12);
    return `${item.quantity} bundle${item.quantity > 1 ? "s" : ""} (${pieces} pieces) – Wholesale`;
  }
  return `${item.quantity} piece${item.quantity > 1 ? "s" : ""} – Retail`;
}

export default function CartEnquiryModal({
  open,
  onClose,
  items,
  onSubmitted,
}: CartEnquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setName("");
    setPhone("");
    setError("");
    setSubmitting(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (phone.trim().length < 6) {
      setError("Please enter a valid phone number.");
      return;
    }

    setError("");
    setSubmitting(true);

    const first = items[0];
    const totalQuantity = items.reduce(
      (sum, item) =>
        sum + (item.mode === "wholesale" ? item.quantity * (item.bundleSize || 12) : item.quantity),
      0,
    );
    const itemLines = items
      .map((item, index) => `${index + 1}. ${item.name} — ${quantityLabel(item)}`)
      .join("\n");

    const whatsappUrl = buildWhatsAppCartUrl(
      items.map((item) => ({
        productName: item.name,
        productLink: `https://thangaveltextile.in/products/${item.slug}`,
        color: item.color,
        size: item.size,
        quantityLabel: quantityLabel(item),
      })),
    );

    try {
      await api.submitOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        productName:
          items.length === 1 ? first.name : `${items.length} products (cart enquiry)`,
        productSlug: items.length === 1 ? first.slug : undefined,
        color: items.length === 1 ? first.color : undefined,
        size: items.length === 1 ? first.size : undefined,
        quantity: totalQuantity,
        message: `Cart enquiry — ${items.length} product${items.length > 1 ? "s" : ""}:\n${itemLines}`,
        source: "product_enquiry",
      });
    } catch (err) {
      console.error("Failed to save cart enquiry:", err);
    } finally {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      onSubmitted();
      reset();
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-primary-950/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-lg border border-primary-100 bg-white shadow-warm"
          >
            <div className="flex items-center justify-between border-b border-primary-100 bg-primary-50 px-5 py-4">
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-secondary">
                  <FaWhatsapp className="h-3 w-3" />
                  One quick step
                </div>
                <h3 className="text-lg font-extrabold text-primary-950">
                  Share your details
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-lg bg-white text-primary-800 shadow-soft transition hover:bg-primary-600 hover:text-white"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-primary-100 bg-primary-50/60 p-3">
                {items.map((item) => (
                  <div key={item.key} className="flex items-start justify-between gap-2 text-xs">
                    <span className="flex-1 font-semibold text-ink">{item.name}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-ink-muted">
                      {item.mode === "wholesale" ? (
                        <FaBoxes className="h-2.5 w-2.5" />
                      ) : (
                        <FaStore className="h-2.5 w-2.5" />
                      )}
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed text-ink-muted">
                So our team can follow up on your{" "}
                <span className="font-semibold text-ink">
                  {items.length} product{items.length > 1 ? "s" : ""}
                </span>
                , please share your name and phone number before continuing to WhatsApp.
              </p>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                  Your Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="field rounded-lg"
                  autoFocus
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                  Phone Number
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 ..."
                  className="field rounded-lg"
                />
              </label>

              {error && (
                <p className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-800">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark disabled:opacity-60"
              >
                {submitting ? (
                  <FaSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  <FaWhatsapp className="h-4 w-4" />
                )}
                Continue to WhatsApp
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
