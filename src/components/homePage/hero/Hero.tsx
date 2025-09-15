"use client";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import { SwiperSlide } from "swiper/react";
import HeroSlide from "./HeroSlide";
import Flowers from "./Flowers";

interface HeroProps {
  banners: {
    title: string;
    description: string;
    image: string;
    button: {
      label: string;
      link: string;
      position: string;
    };
    order: number;
  }[];
}

export default function Hero({ banners }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
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
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={idx}>
            <HeroSlide banner={banner} />
          </SwiperSlide>
        ))}
      </SwiperWrapper>
    </section>
  );
}
