"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBoxes, FaChevronDown, FaQuestionCircle, FaStore } from "react-icons/fa";

interface FAQ {
  id: string;
  question: string;
  answer: string;
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
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.id}
            className={`overflow-hidden rounded-lg border transition ${
              isOpen
                ? "border-secondary bg-white shadow-warm"
                : "border-primary-100 bg-white shadow-soft hover:border-primary-300"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-start justify-between gap-4 p-5 text-left md:p-6"
              aria-expanded={isOpen}
            >
              <div className="flex min-w-0 items-start gap-4">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg text-sm font-extrabold transition ${
                    isOpen
                      ? "bg-secondary text-white"
                      : "bg-primary-50 text-primary-800 group-hover:bg-primary-600 group-hover:text-white"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                      <FaStore className="h-3 w-3 text-primary-600" />
                      Retail
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest-x text-secondary-dark">
                      <FaBoxes className="h-3 w-3" />
                      Wholesale
                    </span>
                  </span>
                  <span className="block text-lg font-extrabold leading-tight text-primary-950 transition group-hover:text-primary-700 md:text-xl">
                    {item.question}
                  </span>
                </span>
              </div>
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition duration-300 ${
                  isOpen
                    ? "rotate-180 border-secondary bg-secondary text-white"
                    : "border-primary-200 text-primary-800 group-hover:border-primary-600"
                }`}
              >
                <FaChevronDown className="h-3.5 w-3.5" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 md:px-6 md:pb-6">
                    <div className="ml-0 rounded-lg border border-primary-100 bg-primary-50 p-4 text-sm leading-7 text-ink-muted md:ml-[60px]">
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-secondary">
                        <FaQuestionCircle className="h-3 w-3" />
                        Answer
                      </div>
                      {item.answer}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
