"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  action?: ReactNode;
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  action,
}: Props) {
  const isCenter = align === "center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mb-10 flex flex-col items-start gap-4 sm:mb-12 sm:flex-row sm:flex-nowrap sm:items-end sm:justify-between"
    >
      <div
        className={cn(
          "min-w-0 flex-1 max-w-3xl",
          isCenter && "mx-auto text-center"
        )}
      >
        {eyebrow && (
          <div
            className={cn(
              "mb-4 inline-flex items-center gap-2 rounded-full py-1 pl-1.5 pr-3.5",
              light
                ? "bg-cream-50/10 ring-1 ring-inset ring-cream-50/20"
                : "bg-secondary/10 ring-1 ring-inset ring-secondary/20",
              isCenter && "mx-auto"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                light ? "bg-secondary-light" : "bg-secondary"
              )}
            />
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider-x",
                light ? "text-secondary-light" : "text-secondary-dark"
              )}
            >
              {eyebrow}
            </span>
          </div>
        )}
        <h2
          className={cn(
            "font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl",
            light
              ? "text-cream-50"
              : "bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 bg-clip-text text-transparent"
          )}
        >
          {title}
        </h2>
        <span
          aria-hidden="true"
          className={cn(
            "mt-4 block h-1 w-14 origin-left scale-x-100 rounded-full bg-gradient-to-r",
            light
              ? "from-secondary-light to-secondary-light/0"
              : "from-secondary to-secondary/0",
            isCenter && "mx-auto"
          )}
        />
        {description && (
          <p
            className={cn(
              "mt-4 max-w-2xl text-base leading-7 md:text-lg",
              isCenter && "mx-auto",
              light ? "text-cream-100/80" : "text-ink-soft"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
