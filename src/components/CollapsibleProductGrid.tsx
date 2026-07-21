"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

type CollapsibleProductGridProps = {
  products: Product[];
  initialCount?: number;
};

export default function CollapsibleProductGrid({
  products,
  initialCount = 8,
}: CollapsibleProductGridProps) {
  const sliderRef = useRef<SwiperInstance | null>(null);
  const visibleProducts = products.slice(0, initialCount);

  if (visibleProducts.length === 0) return null;

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          sliderRef.current = swiper;
        }}
        loop={visibleProducts.length > 4}
        autoplay={{
          delay: 2200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          768: { slidesPerView: 3, spaceBetween: 28 },
          1024: { slidesPerView: 4, spaceBetween: 28 },
        }}
        className="!px-1 !pb-2"
      >
        {visibleProducts.map((product) => (
          <SwiperSlide key={product.id} className="!h-auto">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        onClick={() => sliderRef.current?.slidePrev()}
        aria-label="Previous products"
        className="absolute left-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-stone-800 shadow-lg transition-all hover:bg-amber-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:-left-5"
      >
        <FiChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => sliderRef.current?.slideNext()}
        aria-label="Next products"
        className="absolute right-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-stone-800 shadow-lg transition-all hover:bg-amber-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:-right-5"
      >
        <FiChevronRight aria-hidden="true" />
      </button>
    </div>
  );
}
