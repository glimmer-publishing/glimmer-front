"use client";
import Container from "../../shared/container/Container";
import SectionTitle from "../../shared/titles/SectionTitle";
import ReviewedSlider from "./ReviewedSlider";
import { useReviewedProductsStore } from "@/store/reviewedProductsStore";

export default function ReviewedProducts() {
  const { reviewedProducts } = useReviewedProductsStore();

  if (!reviewedProducts) return null;

  return (
    <section className="py-8 lg:py-10">
      <Container>
        <SectionTitle className="mb-6 lg:mb-12">
          Переглянуті товари
        </SectionTitle>
        <ReviewedSlider reviewedProducts={reviewedProducts} />
      </Container>
    </section>
  );
}
