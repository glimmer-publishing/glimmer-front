"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ReactNode } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper } from "swiper/react";
import { SwiperOptions } from "swiper/types";
import { createPagination } from "./CustomPagination";

interface SwiperWrapperProps {
  children: ReactNode;
  breakpoints: SwiperOptions["breakpoints"];
  swiperClassName: string;
  loop?: boolean;
  isPagination?: boolean;
  autoplay?: SwiperOptions["autoplay"];
}

export default function SwiperWrapper({
  children,
  breakpoints,
  swiperClassName,
  loop = false,
  isPagination = true,
  autoplay = false,
}: SwiperWrapperProps) {
  return (
    <Swiper
      pagination={isPagination ? createPagination(3) : false}
      breakpoints={breakpoints}
      navigation={true}
      loop={loop}
      speed={1000}
      autoplay={autoplay}
      modules={[Navigation, Pagination, Autoplay]}
      className={swiperClassName}
    >
      {children}
    </Swiper>
  );
}
