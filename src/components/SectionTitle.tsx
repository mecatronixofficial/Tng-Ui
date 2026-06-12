"use client";

import { motion } from "framer-motion";
import { FaBoxes, FaStore } from "react-icons/fa";
import { cn } from "@/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  decorative?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  decorative = true,
}: Props) {
  const isCenter = align === "center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "max-w-3xl mb-12",
        isCenter && "mx-auto text-center"
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "flex items-center gap-3 mb-5",
            isCenter && "justify-center"
          )}
        >
          {decorative && (
            <span
              className={cn(
                "hidden h-px w-10 sm:block",
                light ? "bg-secondary-light" : "bg-secondary",
              )}
            />
          )}
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x shadow-soft",
              light
                ? "border-secondary/40 bg-white/8 text-secondary-light"
                : "border-primary-100 bg-white text-primary-800"
            )}
          >
            <FaStore className={cn("h-3 w-3", light ? "text-secondary-light" : "text-primary-600")} />
            {eyebrow}
            <span className="h-3 w-px bg-current opacity-25" />
            <FaBoxes className={cn("h-3 w-3", light ? "text-secondary-light" : "text-secondary")} />
          </span>
          {decorative && (
            <span
              className={cn(
                "hidden h-px w-10 sm:block",
                light ? "bg-secondary-light" : "bg-secondary",
              )}
            />
          )}
        </div>
      )}
      <h2
        className={cn(
          "text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.05] tracking-tight",
          light ? "text-cream-50" : "text-primary-950"
        )}
      >
        {title}
      </h2>
      {decorative && (
        <div
          className={cn(
            "mt-5 flex items-center gap-2",
            isCenter && "justify-center",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-10 rounded-full",
              light ? "bg-secondary-light" : "bg-secondary",
            )}
          />
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              light ? "bg-cream-50/60" : "bg-primary-300",
            )}
          />
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              light ? "bg-cream-50/40" : "bg-primary-200",
            )}
          />
        </div>
      )}
      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-7 md:text-lg",
            isCenter && "mx-auto",
            light ? "text-cream-100/80" : "text-ink-soft"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
