"use client";

import { useRouter } from "next/navigation";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  bgImage?: string;
  breadcrumbs?: Crumb[];
}

export default function PageHero({
  title,
  eyebrow,
  bgImage,
  breadcrumbs,
}: PageHeroProps) {
  const router = useRouter();

  return (
    <section className="relative bg-primary-950 overflow-hidden border-b border-white/10">
      {bgImage && (
        <>
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/70 to-transparent" />
        </>
      )}
      <div className="absolute inset-0 bg-weave-dark opacity-20" />

      <div className="relative container-x py-10 md:py-14">
        <div className="max-w-xl">
          {breadcrumbs && (
            <div className="mb-3">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          {eyebrow && (
            <span className="inline-flex items-center rounded-full border border-green-400/30 bg-green-400/10 px-2.5 py-1 text-[10px] uppercase tracking-widest-x text-green-400 font-semibold">
              {eyebrow}
            </span>
          )}
          <h1 className="display mt-3 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
