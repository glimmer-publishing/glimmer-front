"use client";
import { useState } from "react";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import { SwiperSlide } from "swiper/react";
import HeroSlide from "./HeroSlide";
import Flowers from "./Flowers";

interface HeroProps {
  banners: {
    title: string;
    description: string;
    imageMob: string;
    imageTab: string;
    imageDesk: string;
    button: {
      label: string;
      link: string;
      position: string;
    };
    order: number;
  }[];
}

export default function Hero({ banners }: HeroProps) {
  /* Banner index (Swiper's realIndex, stable under `loop`) of the slide on
     screen. Only it and its neighbours fetch their image; the rest wait. */
  const [activeIndex, setActiveIndex] = useState(0);
  const count = banners.length;

  const isNearActive = (idx: number) =>
    idx === activeIndex ||
    idx === (activeIndex + 1) % count ||
    idx === (activeIndex - 1 + count) % count;

  return (
    <section className="relative overflow-hidden pt-[85px]">
      <Flowers />
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
            <HeroSlide
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
