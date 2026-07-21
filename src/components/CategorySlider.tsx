"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import CategoryCard from "@/components/CategoryCard";
import type { Category } from "@/types";

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const sliderRef = useRef<SwiperInstance | null>(null);

  return (
    <div className="relative">
      <Swiper
        onSwiper={(swiper) => {
          sliderRef.current = swiper;
        }}
        loop={categories.length > 1}
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          480: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4 },
        }}
        className="!px-1 !pb-4"
      >
        {categories.map((c, i) => (
          <SwiperSlide key={c.id} className="!h-auto">
            <CategoryCard category={c} index={i} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        onClick={() => sliderRef.current?.slidePrev()}
        aria-label="Previous categories"
        className="absolute left-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-stone-800 shadow-lg transition-all hover:bg-amber-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:-left-5"
      >
        <FiChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => sliderRef.current?.slideNext()}
        aria-label="Next categories"
        className="absolute right-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-stone-800 shadow-lg transition-all hover:bg-amber-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:-right-5"
      >
        <FiChevronRight aria-hidden="true" />
      </button>
    </div>
  );
}
