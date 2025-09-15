"use client";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import { SwiperSlide } from "swiper/react";
import * as motion from "motion/react-client";
import { Genre } from "@/types/genre";
import GenreCard from "./GenreCard";
import { fadeInAnimation } from "@/utils/animationVariants";
import Container from "@/components/shared/container/Container";

interface GenresProps {
  genres: Genre[];
}

export default function Genres({ genres }: GenresProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({ y: 30 })}
      className="py-8 lg:py-10"
    >
      <Container className="overflow-visible relative">
        {/* Слайдер "пришитий" лівим боком до контейнера, праворуч може виходити за межі */}
        <div className="relative left-0 overflow-visible">
          <div className="w-screen xl:w-full overflow-visible">
            <SwiperWrapper
              swiperClassName="genres"
              loop
              breakpoints={{
                0: {
                  spaceBetween: 19.5,
                  slidesPerView: "auto",
                },
                1280: {
                  spaceBetween: 19.5,
                  slidesPerView: 6,
                },
              }}
            >
              {genres.map((genre, idx) => (
                <SwiperSlide key={idx}>
                  <GenreCard genre={genre} />
                </SwiperSlide>
              ))}
            </SwiperWrapper>
          </div>
        </div>
      </Container>
    </motion.section>
  );
}
