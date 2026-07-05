"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FaBoxes,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaStore,
  FaTags,
  FaWhatsapp,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import { api } from "@/lib/api";
import { cn } from "@/utils";

interface Props {
  defaultProduct?: string;
}

const enquiryTypes = [
  {
    value: "retail",
    label: "Retail",
    description: "Single pieces and family shopping",
    Icon: FaStore,
  },
  {
    value: "wholesale",
    label: "Wholesale",
    description: "Bulk orders for shops and traders",
    Icon: FaBoxes,
  },
] as const;

const clothOptions = [
  "Petticoats",
  "Lungis",
  "Towels",
  "Gamcha",
  "Bed Sheets",
  "Dhoti",
  "Handloom",
];

const sizeOptions = [
  "Free Size",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "36",
  "38",
  "40",
  "42",
  "44",
  "Single",
  "Double",
  "King",
  "Mixed Sizes",
];

const colorOptions = [
  "White",
  "Black",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Maroon",
  "Cream",
  "Checked",
  "Printed",
  "Mixed Colors",
];

const whatsappNumber = siteConfig.whatsapp.replace(/\D/g, "");

export default function ContactForm({ defaultProduct = "" }: Props) {
  const [state, setState] = useState({
    name: "",
    email: "",
    phone: "",
    product: defaultProduct,
    color: "",
    size: "",
    enquiryType: "wholesale",
    quantity: "",
    city: "",
    packing: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const enquiryDetails = [
    `Enquiry type: ${state.enquiryType}`,
    state.product ? `Product: ${state.product}` : "",
    state.quantity ? `Quantity: ${state.quantity}` : "",
    state.color ? `Color: ${state.color}` : "",
    state.size ? `Size: ${state.size}` : "",
    state.packing ? `Packing: ${state.packing}` : "",
    state.city ? `City: ${state.city}` : "",
    state.message,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappMessage = [
    `Hello ${siteConfig.name},`,
    "",
    "I want to send a cloth enquiry.",
    "",
    state.name ? `Name: ${state.name}` : "",
    state.phone ? `Phone: ${state.phone}` : "",
    state.email ? `Email: ${state.email}` : "",
    enquiryDetails,
    "",
    "Please share availability details.",
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  async function handle(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!state.name || !state.phone) {
      setError("Please fill in your name and phone number.");
      return;
    }

    setSubmitting(true);
    try {
      await api.submitOrder({
        customerName: state.name,
        phone: state.phone,
        email: state.email || undefined,
        productName: state.product || undefined,
        color: state.color || undefined,
        size: state.size || undefined,
        quantity: Number(state.quantity) || 1,
        message:
          enquiryDetails || `Enquiry about ${state.product || "your cloth products"}.`,
        source: state.enquiryType === "wholesale" ? "wholesale" : "contact_form",
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Sorry, we couldn't send your enquiry. Please try again or contact us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-secondary/30 bg-white p-8 text-center shadow-soft"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-secondary text-white">
          <FaCheckCircle className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-3xl font-extrabold tracking-tight text-primary-950">
          Enquiry received
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted">
          Thank you. Our team will contact you with retail or wholesale cloth
          details as soon as possible.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary-dark"
          >
            <FaWhatsapp className="h-4 w-4" />
            Continue on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setState({
                name: "",
                email: "",
                phone: "",
                product: "",
                color: "",
                size: "",
                enquiryType: "wholesale",
                quantity: "",
                city: "",
                packing: "",
                message: "",
              });
            }}
            className="inline-flex items-center justify-center rounded-lg border border-primary-200 bg-white px-5 py-3 text-sm font-bold text-primary-900 transition hover:border-primary-600 hover:text-primary-700"
          >
            Send another enquiry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handle} className="space-y-6">
      <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
          <FaTags className="h-3 w-3 text-secondary" />
          Enquiry Type
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {enquiryTypes.map(({ value, label, description, Icon }) => {
            const active = state.enquiryType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setState({ ...state, enquiryType: value })}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 text-left transition",
                  active
                    ? "border-secondary bg-white shadow-soft"
                    : "border-primary-100 bg-white/60 hover:border-primary-300",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white",
                    active ? "bg-secondary" : "bg-primary-600",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-primary-950">
                    {label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-ink-muted">
                    {description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full Name *">
          <input
            type="text"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
            placeholder="Your name"
            className="field rounded-lg"
            required
          />
        </FormField>

        <FormField label="Phone Number *">
          <input
            type="tel"
            value={state.phone}
            onChange={(e) => setState({ ...state, phone: e.target.value })}
            placeholder="+91 ..."
            className="field rounded-lg"
            required
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Email">
          <input
            type="email"
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
            placeholder="you@example.com"
            className="field rounded-lg"
          />
        </FormField>

        <FormField label="Delivery City">
          <div className="relative">
            <FaMapMarkerAlt className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={state.city}
              onChange={(e) => setState({ ...state, city: e.target.value })}
              placeholder="City / district"
              className="field rounded-lg pl-10"
            />
          </div>
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
        <FormField label="Cloth / Product">
          <select
            value={state.product}
            onChange={(e) => setState({ ...state, product: e.target.value })}
            className="field rounded-lg"
          >
            <option value="">Select cloth type</option>
            {defaultProduct && (
              <option value={defaultProduct}>{defaultProduct}</option>
            )}
            {clothOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Quantity">
          <input
            type="number"
            min="1"
            value={state.quantity}
            onChange={(e) => setState({ ...state, quantity: e.target.value })}
            placeholder="Pieces"
            className="field rounded-lg"
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Color / Design">
          <select
            value={state.color}
            onChange={(e) => setState({ ...state, color: e.target.value })}
            className="field rounded-lg"
          >
            <option value="">Select color</option>
            {colorOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Size">
          <select
            value={state.size}
            onChange={(e) => setState({ ...state, size: e.target.value })}
            className="field rounded-lg"
          >
            <option value="">Select size</option>
            {sizeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Packing / Bundle">
          <input
            type="text"
            value={state.packing}
            onChange={(e) => setState({ ...state, packing: e.target.value })}
            placeholder="12 pcs / bundle"
            className="field rounded-lg"
          />
        </FormField>
      </div>

      <FormField label="Requirement Details">
        <textarea
          rows={5}
          value={state.message}
          onChange={(e) => setState({ ...state, message: e.target.value })}
          placeholder="Tell us GSM, fabric, border type, delivery timing, GST billing, wholesale stock requirement..."
          className="field resize-none rounded-lg"
        />
      </FormField>

      {error && (
        <p className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-primary-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary disabled:opacity-60"
        >
          <FaPaperPlane className="h-4 w-4" />
          {submitting ? "Sending..." : "Send Cloth Enquiry"}
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-secondary/30 bg-white px-6 py-3 text-sm font-bold text-secondary transition hover:bg-secondary hover:text-white"
        >
          <FaWhatsapp className="h-4 w-4" />
          WhatsApp Instead
        </a>
      </div>
    </form>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
        {label}
      </span>
      {children}
    </label>
  );
}
