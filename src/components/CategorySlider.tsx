"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import CategoryCard from "@/components/CategoryCard";
import type { Category } from "@/types";

export default function CategorySlider({ categories }: { categories: Category[] }) {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
      loop
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
  );
}
