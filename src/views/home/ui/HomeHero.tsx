"use client";
import { useState } from "react";
import SwiperWrapper from "@/shared/ui/swiper/SwiperWrapper";
import { SwiperSlide } from "swiper/react";
import HomeHeroSlide from "./HomeHeroSlide";
import HomeFlowers from "./HomeFlowers";
import type { HeroBanner } from "../model/types";

type HomeHeroProps = {
  /* Slides in Studio order. */
  banners: HeroBanner[];
};

/**
 * The hero slider of Studio's hero banners.
 */
export default function HomeHero({ banners }: HomeHeroProps) {
  /**
   * Banner index (Swiper's realIndex, stable under `loop`) of the slide on
   * screen. Only it and its neighbours fetch their image; the rest wait.
   */
  const [activeIndex, setActiveIndex] = useState(0);
  const count = banners.length;

  const isNearActive = (idx: number) =>
    idx === activeIndex ||
    idx === (activeIndex + 1) % count ||
    idx === (activeIndex - 1 + count) % count;

  return (
    <section className="relative overflow-hidden pt-[85px]">
      <HomeFlowers />
      <SwiperWrapper
        swiperClassName="heroProducts"
        loop
        isPagination={false}
        autoplay={{
          delay: 15000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        breakpoints={{
          1280: {
            slidesPerView: 1,
          },
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={idx}>
            <HomeHeroSlide
              banner={banner}
              isPriority={idx === 0}
              isEager={isNearActive(idx)}
            />
          </SwiperSlide>
        ))}
      </SwiperWrapper>
    </section>
  );
}
