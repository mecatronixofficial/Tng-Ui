"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaChevronRight, FaHome, FaStore } from "react-icons/fa";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const router = useRouter();

  return (
    <div className="inline-flex max-w-full flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-primary-400/30 bg-primary-900/75 px-4 text-xs font-bold uppercase tracking-wider-x text-primary-200/80 shadow-soft backdrop-blur transition hover:bg-primary-700 hover:text-white active:scale-95"
      >
        <FaArrowLeft className="h-3 w-3 shrink-0 text-primary-300 transition group-hover:-translate-x-0.5 group-hover:text-white" />
      </button>
      <nav aria-label="Breadcrumb" className="inline-flex max-w-full">
        <ol className="flex flex-wrap items-center gap-1.5 rounded-lg border border-primary-400/30 bg-primary-900/75 p-1.5 text-xs font-bold uppercase tracking-wider-x shadow-soft backdrop-blur">
          {items.map((c, i) => (
            <li key={i} className="flex min-w-0 items-center gap-1.5">
              {c.href ? (
                <Link
                  href={c.href}
                  className="group inline-flex max-w-[180px] items-center gap-2 rounded-md px-2.5 py-1.5 text-primary-200/80 transition hover:bg-primary-700 hover:text-white sm:max-w-none"
                >
                  {i === 0 ? (
                    <FaHome className="h-3 w-3 shrink-0 text-primary-300 transition group-hover:text-white" />
                  ) : (
                    <FaStore className="h-3 w-3 shrink-0 text-primary-300 transition group-hover:text-white" />
                  )}
                  <span className="truncate">{c.label}</span>
                </Link>
              ) : (
                <span className="inline-flex max-w-[220px] items-center gap-2 rounded-md bg-primary-600 px-2.5 py-1.5 text-white shadow-soft sm:max-w-none">
                  <FaStore className="h-3 w-3 shrink-0" />
                  <span className="truncate">{c.label}</span>
                </span>
              )}
              {i < items.length - 1 && (
                <FaChevronRight className="h-2.5 w-2.5 shrink-0 text-primary-300/70" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
