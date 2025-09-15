import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import { SwiperSlide } from "swiper/react";
import ProductCard from "@/components/shared/productCard/ProductCard";
import { Product } from "@/types/product";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface ReviewedSliderProps {
  reviewedProducts: Product[];
}

export default function ReviewedSlider({
  reviewedProducts,
}: ReviewedSliderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({ y: 30 })}
    >
      <SwiperWrapper
        swiperClassName="reviewedProducts"
        loop
        breakpoints={{
          0: {
            spaceBetween: 16,
            slidesPerView: 2,
          },
          500: { spaceBetween: 16, slidesPerView: 3 },
          768: { spaceBetween: 16, slidesPerView: 4 },
          1280: {
            spaceBetween: 16,
            slidesPerView: 5,
          },
        }}
      >
        {reviewedProducts.map((product, idx) => (
          <SwiperSlide key={idx}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </SwiperWrapper>
    </motion.div>
  );
}
