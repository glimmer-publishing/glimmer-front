"use client";
import { Product } from "@/entities/product/model/product";
import { useState } from "react";
import ProductReviews from "./ProductReviews";
import { useMarkReviewed } from "@/entities/reviewed-product/hooks/useReviewed";
import WriteReview from "@/features/write-review/ui/WriteReview";
import Container from "@/shared/ui/container/Container";
import ProductOrder from "./ProductOrder";
import ProductImagePicker from "./ProductImagePicker";
import ProductDescription from "./ProductDescription";
import ProductReadPassage from "./ProductReadPassage";
import ProductFeatures from "./ProductFeatures";
import ProductDetails from "./ProductDetails";

type ProductInfoProps = {
  /* The book on the page. */
  currentProduct: Product;
};

/**
 * Gallery, details, price and buy block, description, reading preview,
 * features and reviews. Records the book in the viewed-books history.
 */
export default function ProductInfo({ currentProduct }: ProductInfoProps) {
  useMarkReviewed(currentProduct.slug);

  /* Shared by the buy block and the reading preview's mobile buy button. */
  const [count, setCount] = useState(1);

  /**
   * Every `ImageGallery` binds its key handler to `document`, so without this
   * the arrow keys drive every gallery on the page at once - including the one
   * hidden behind an open modal. Lifted here because the two galleries are
   * siblings and neither can see the other's state.
   */
  const [isReadPassageShown, setIsReadPassageShown] = useState(false);

  const { description, bookScreens, features, reviews, gallery } =
    currentProduct;

  return (
    <section className="pb-8 lg:pb-10">
      <Container className="md:flex gap-5">
        <div className="md:w-[calc(50%-10px)]">
          <ProductImagePicker
            photos={gallery}
            productTitle={currentProduct.title}
            isOverlayShown={isReadPassageShown}
          />
          <div className="hidden md:block">
            <ProductReviews
              reviews={reviews}
              action={<WriteReview currentProduct={currentProduct} />}
            />
          </div>
        </div>
        <div className="md:w-[calc(50%-10px)]">
          <ProductDetails currentProduct={currentProduct} />
          <ProductOrder
            currentProduct={currentProduct}
            count={count}
            setCount={setCount}
          />
          {(!!description || !!bookScreens) && (
            <div className="flex flex-col gap-4 lg:gap-6 py-4 lg:py-6">
              {!!description && (
                <ProductDescription description={description} />
              )}
              {!!bookScreens && (
                <ProductReadPassage
                  bookScreens={bookScreens}
                  currentProduct={currentProduct}
                  count={count}
                  isModalShown={isReadPassageShown}
                  setIsModalShown={setIsReadPassageShown}
                />
              )}
            </div>
          )}
          {!!features && <ProductFeatures features={features} />}
          <div className="md:hidden">
            <ProductReviews
              reviews={reviews}
              action={<WriteReview currentProduct={currentProduct} />}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
