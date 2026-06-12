"use client";

import { useState } from "react";
import {
  FaBoxes,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaShoppingBag,
  FaStar,
  FaStore,
} from "react-icons/fa";

import { api } from "@/lib/api";
import { cn } from "@/utils";

const empty = {
  name: "",
  role: "Retail Customer",
  company: "",
  location: "",
  rating: 5,
  review: "",
  productPurchased: "",
  buyerType: "retail",
};

const buyerTypes = [
  {
    value: "retail",
    label: "Retail Buyer",
    role: "Retail Customer",
    description: "Family shopping or personal use",
    Icon: FaStore,
  },
  {
    value: "wholesale",
    label: "Wholesale Buyer",
    role: "Wholesale Customer",
    description: "Shop, reseller or bulk cloth order",
    Icon: FaBoxes,
  },
] as const;

const productOptions = [
  "Petticoats",
  "Lungis",
  "Towels",
  "Gamcha",
  "Bed Sheets",
  "Dhoti",
  "Handloom",
];

export default function WriteReviewForm() {
  const [form, setForm] = useState({ ...empty });
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  function set(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.role || !form.location || !form.review) {
      setError("Name, buyer type, location and review are required.");
      return;
    }
    setError("");
    setStatus("saving");
    try {
      await api.submitReview({
        name: form.name,
        role: form.role,
        location: form.location,
        rating: form.rating,
        review: form.review,
        ...(form.company ? { company: form.company } : {}),
        ...(form.productPurchased
          ? { productPurchased: form.productPurchased }
          : {}),
      });
      setStatus("done");
      setForm({ ...empty });
    } catch (err) {
      setError((err as Error).message || "Failed to submit. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-secondary/30 bg-white p-8 text-center shadow-warm md:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-secondary text-white">
          <FaCheckCircle className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-2xl font-extrabold text-primary-950">
          Thank you for the cloth review
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted">
          Your retail or wholesale buyer review has been submitted and will be
          visible after our team approves it.
        </p>
        <button
          className="mt-6 inline-flex items-center justify-center rounded-lg border border-primary-200 bg-white px-5 py-3 text-sm font-bold text-primary-900 transition hover:border-secondary hover:text-secondary"
          onClick={() => setStatus("idle")}
        >
          Write Another Review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft"
    >
      <div className="border-b border-primary-100 bg-primary-50 p-5 md:p-6">
        <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800 shadow-soft">
          <FaStore className="h-3 w-3 text-primary-600" />
          Retail
          <span className="h-3 w-px bg-primary-200" />
          <FaBoxes className="h-3 w-3 text-secondary" />
          Wholesale review
        </div>
        <h3 className="mt-4 text-3xl font-extrabold leading-tight text-primary-950">
          Share your cloth buying experience
        </h3>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          Reviews help other retail customers and wholesale buyers choose the
          right cloth products.
        </p>
      </div>

      <div className="space-y-6 p-5 md:p-6">
        <div>
          <Label>Buyer Type</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {buyerTypes.map(({ value, label, role, description, Icon }) => {
              const active = form.buyerType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, buyerType: value, role }))
                  }
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 text-left transition",
                    active
                      ? "border-secondary bg-secondary/10"
                      : "border-primary-100 bg-primary-50 hover:border-primary-400",
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

        <div>
          <Label required>Rating</Label>
          <div className="flex w-fit gap-1 rounded-lg border border-primary-100 bg-primary-50 p-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => set("rating", n)}
                className="rounded-md p-1 transition hover:scale-110"
                aria-label={`${n} star rating`}
              >
                <FaStar
                  className={cn(
                    "h-7 w-7 transition-colors",
                    n <= (hover || form.rating)
                      ? "text-secondary"
                      : "text-primary-100",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Your Name" required>
            <input
              className="field rounded-lg"
              placeholder="Ravi Kumar"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </FormField>
          <FormField label="Role / Occupation" required>
            <input
              className="field rounded-lg"
              placeholder="Retail owner, homemaker, reseller..."
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Location" required>
            <div className="relative">
              <FaMapMarkerAlt className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary" />
              <input
                className="field rounded-lg pl-10"
                placeholder="Chennai, TN"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
          </FormField>
          <FormField label="Shop / Company">
            <input
              className="field rounded-lg"
              placeholder="Your shop or company"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Product Purchased">
          <div className="relative">
            <FaShoppingBag className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary" />
            <select
              className="field rounded-lg pl-10"
              value={form.productPurchased}
              onChange={(e) => set("productPurchased", e.target.value)}
            >
              <option value="">Select cloth product</option>
              {productOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </FormField>

        <FormField label="Your Review" required>
          <textarea
            rows={5}
            className="field resize-none rounded-lg"
            placeholder="Tell us about fabric quality, packing, delivery, retail shopping or wholesale order experience..."
            value={form.review}
            onChange={(e) => set("review", e.target.value)}
          />
        </FormField>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="border-t border-primary-100 pt-6">
          <button
            type="submit"
            disabled={status === "saving"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <FaPaperPlane className="h-4 w-4" />
            {status === "saving" ? "Submitting..." : "Submit Buyer Review"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Label({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="mb-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
      {children} {required && <span className="text-secondary">*</span>}
    </div>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <Label required={required}>{label}</Label>
      {children}
    </label>
  );
}
