"use client";

import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaSpinner, FaTimes, FaWhatsapp } from "react-icons/fa";

import { api, OrderSource } from "@/lib/api";

interface OrderEnquiryModalProps {
  open: boolean;
  onClose: () => void;
  whatsappUrl: string;
  productName: string;
  productSlug?: string;
  color?: string;
  size?: string;
  quantity: number;
  quantityLabel: string;
  source: OrderSource;
}

export default function OrderEnquiryModal({
  open,
  onClose,
  whatsappUrl,
  productName,
  productSlug,
  color,
  size,
  quantity,
  quantityLabel,
  source,
}: OrderEnquiryModalProps) {
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
    try {
      await api.submitOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        productName,
        productSlug,
        color,
        size,
        quantity,
        message: `Enquiry via WhatsApp button — ${quantityLabel}`,
        source,
      });
    } catch (err) {
      console.error("Failed to save order enquiry:", err);
    } finally {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      reset();
      onClose();
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-primary-950/60 p-4 backdrop-blur-sm"
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
              <p className="text-xs leading-relaxed text-ink-muted">
                So our team can follow up on <span className="font-semibold text-ink">{productName}</span>, please share your name and phone number before continuing to WhatsApp.
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
    </AnimatePresence>,
    document.body,
  );
}
