"use client";

import { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

type CollapsibleProductGridProps = {
  products: Product[];
  initialCount?: number;
  showLabel?: string;
  hideLabel?: string;
};

export default function CollapsibleProductGrid({
  products,
  initialCount = 4,
  showLabel = "Show Products",
  hideLabel = "Hide Products",
}: CollapsibleProductGridProps) {
  const [expanded, setExpanded] = useState(false);
  const hasHiddenProducts = products.length > initialCount;
  const visibleProducts = useMemo(() => {
    if (expanded) return products;
    return products.slice(0, initialCount);
  }, [expanded, initialCount, products]);

  if (products.length === 0) return null;

  return (
    <div>
      {visibleProducts.length > 0 && (
        <div className="grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {hasHiddenProducts && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 px-5 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-300 hover:text-primary-900"
          >
            {expanded ? hideLabel : showLabel}
            <FaChevronDown
              className={[
                "h-3 w-3 transition-transform duration-200",
                expanded ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </div>
      )}
    </div>
  );
}
