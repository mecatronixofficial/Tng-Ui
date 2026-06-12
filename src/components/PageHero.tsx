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
  subtitle,
  eyebrow,
  bgImage,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="relative bg-primary-950 overflow-hidden">
      {bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/85 to-primary-950" />
        </>
      )}
      <div className="absolute inset-0 bg-weave-dark opacity-50" />

      <div className="relative container-x py-24 md:py-32">
        {breadcrumbs && (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        {eyebrow && (
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-green-400" />
            <span className="text-[11px] uppercase tracking-widest-x text-green-400 font-semibold">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="display text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight max-w-4xl text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg text-cream-100 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
