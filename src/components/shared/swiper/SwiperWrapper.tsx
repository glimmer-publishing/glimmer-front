"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ReactNode } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper } from "swiper/react";
import { Swiper as SwiperClass, SwiperOptions } from "swiper/types";
import { createPagination } from "./CustomPagination";
import { useScreenWidth } from "@/hooks/useScreenWidth";

interface SwiperWrapperProps {
  children: ReactNode;
  breakpoints: SwiperOptions["breakpoints"];
  swiperClassName: string;
  loop?: boolean;
  isPagination?: boolean;
  autoplay?: SwiperOptions["autoplay"];
  onSlideChange?: (swiper: SwiperClass) => void;
}

export default function SwiperWrapper({
  children,
  breakpoints,
  swiperClassName,
  loop = false,
  isPagination = true,
  autoplay = false,
  onSlideChange,
}: SwiperWrapperProps) {
  const screenWidth = useScreenWidth();
  const isDesktop = screenWidth >= 1024;
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
