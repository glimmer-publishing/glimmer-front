"use client";
import { useFetchReviewedProducts } from "../hooks/useFetchReviewedProducts";
import ProductSliderSection from "@/widgets/products/ui/ProductSliderSection";

type ProductReviewedProductsProps = {
  /* The book on the page, left out of its own history. */
  currentSlug: string;
};

/**
 * "Переглянуті товари": the books viewed before this one, most recent
 * first. Not shown when there are none.
 */
export default function ProductReviewedProducts({
  currentSlug,
}: ProductReviewedProductsProps) {
  const products = useFetchReviewedProducts(currentSlug);

  return (
    <ProductSliderSection
      title="Переглянуті товари"
      products={products}
      swiperClassName="reviewedProducts"
    />
  );
}
