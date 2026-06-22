"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBoxes, FaChevronDown, FaStore } from "react-icons/fa";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: "retail" | "wholesale" | "both";
}

export default function FAQAccordion({
  items,
  defaultOpen = 0,
}: {
  items: FAQ[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-primary-100 rounded-2xl border border-primary-100 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        const category = item.category ?? "both";
        const showRetail = category === "retail" || category === "both";
        const showWholesale = category === "wholesale" || category === "both";

        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-4 p-5 text-left md:p-6"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
            >
              <div className="min-w-0">
                <span
                  className={`block text-base font-bold leading-snug md:text-lg ${
                    isOpen ? "text-primary-950" : "text-primary-900"
                  }`}
                >
                  {item.question}
                </span>
              </div>

              <FaChevronDown
                className={`mt-1 h-4 w-4 shrink-0 text-primary-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-7 text-ink-muted md:px-6 md:pb-6">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}