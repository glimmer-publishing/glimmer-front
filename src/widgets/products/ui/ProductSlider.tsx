"use client";
import { SwiperSlide } from "swiper/react";
import * as motion from "motion/react-client";
import AddToCart from "@/features/add-to-cart/ui/AddToCart";
import ToggleFavorite from "@/features/toggle-favorite/ui/ToggleFavorite";
import ProductCard from "./ProductCard";
import SwiperWrapper from "@/shared/ui/swiper/SwiperWrapper";
import { Product } from "@/entities/product/model/product";
import { fadeInAnimation } from "@/shared/lib/animation/animationVariants";

type ProductSliderProps = {
  /* The cards, in order. */
  products: Product[];
  /* Swiper class; globals.css styles each slider by it. */
  swiperClassName: string;
};

/* Slides per view and spacing per screen width. */
const BREAKPOINTS = {
  0: { spaceBetween: 16, slidesPerView: 2 },
  500: { spaceBetween: 16, slidesPerView: 3 },
  768: { spaceBetween: 16, slidesPerView: 4 },
  1280: { spaceBetween: 16, slidesPerView: 5 },
};

/**
 * A looping row of product cards with the favorite and buy actions, as on
 * the home page and the product page.
 */
export default function ProductSlider({
  products,
  swiperClassName,
}: ProductSliderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({ y: 30 })}
    >
      <SwiperWrapper
        swiperClassName={swiperClassName}
        loop
        breakpoints={BREAKPOINTS}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard
              product={product}
              topAction={<ToggleFavorite slug={product.slug} />}
              action={<AddToCart product={product} />}
            />
          </SwiperSlide>
        ))}
      </SwiperWrapper>
    </motion.div>
  );
}
