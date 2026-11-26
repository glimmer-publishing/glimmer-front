"use client";
import { useReviewedProducts } from "../api/useReviewedProducts";
import ProductSliderSection from "@/widgets/products/ui/ProductSliderSection";

interface ReviewedProductsProps {
  /* The book on the page, left out of its own history. */
  currentSlug: string;
}

/**
 * "Переглянуті товари": the books viewed before this one, most recent
 * first. Not shown when there are none.
 */
export default function ReviewedProducts({
  currentSlug,
}: ReviewedProductsProps) {
  const products = useReviewedProducts(currentSlug);

  return (
    <ProductSliderSection
      title="Переглянуті товари"
      products={products}
      swiperClassName="reviewedProducts"
    />
  );
}
