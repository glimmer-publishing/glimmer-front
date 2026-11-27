"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ReactNode } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper } from "swiper/react";
import { Swiper as SwiperClass, SwiperOptions } from "swiper/types";
import { createPagination } from "./SwiperPagination";
import { useScreenWidth } from "@/shared/hooks/useScreenWidth";

type SwiperWrapperProps = {
  /* The slides, each a SwiperSlide. */
  children: ReactNode;
  /* Slides per view and spacing per screen width. */
  breakpoints: SwiperOptions["breakpoints"];
  /* Classes of the Swiper element. */
  swiperClassName: string;
  /* Wraps around after the last slide. */
  loop?: boolean;
  /* Shows the pagination dots. */
  isPagination?: boolean;
  /* Swiper autoplay options. */
  autoplay?: SwiperOptions["autoplay"];
  /* Called when the active slide changes. */
  onSlideChange?: (swiper: SwiperClass) => void;
};

/**
 * A Swiper carousel with the site's navigation and pagination; children are
 * the slides.
 */
export default function SwiperWrapper({
  children,
  breakpoints,
  swiperClassName,
  loop = false,
  isPagination = true,
  autoplay = false,
  onSlideChange,
}: SwiperWrapperProps) {
  const { isDesktop } = useScreenWidth();
  return (
    <Swiper
      pagination={isPagination ? createPagination(3) : false}
      breakpoints={breakpoints}
      navigation={true}
      loop={loop}
      speed={1000}
      autoplay={autoplay}
      centerInsufficientSlides={isDesktop}
      modules={[Navigation, Pagination, Autoplay]}
      className={swiperClassName}
      onSlideChange={onSlideChange}
    >
      {children}
    </Swiper>
  );
}
