"use client";
import { Product } from "@/entities/product/model/product";
import { useState } from "react";
import Reviews from "./Reviews";
import { useMarkReviewed } from "@/entities/reviewed-product/model/useReviewed";
import WriteReview from "@/features/write-review/ui/WriteReview";
import Container from "@/shared/ui/container/Container";
import OrderProduct from "./OrderProduct";
import ImagePicker from "./ImagePicker";
import Description from "./Description";
import ReadPassage from "./ReadPassage";
import Features from "./Features";
import ProductDetails from "./ProductDetails";

interface ProductInfoProps {
  /* The book on the page. */
  currentProduct: Product;
}

/**
 * Gallery, details, price and buy block, description, reading preview,
 * features and reviews. Records the book in the viewed-books history.
 */
export default function ProductInfo({ currentProduct }: ProductInfoProps) {
  useMarkReviewed(currentProduct.slug);

  /* Shared by the buy block and the reading preview's mobile buy button. */
  const [count, setCount] = useState(1);

  /* Every `ImageGallery` binds its key handler to `document`, so without this
     the arrow keys drive every gallery on the page at once - including the one
     hidden behind an open modal. Lifted here because the two galleries are
     siblings and neither can see the other's state. */
  const [isReadPassageShown, setIsReadPassageShown] = useState(false);

  const { description, bookScreens, features, reviews, gallery } =
    currentProduct;

  return (
    <section className="pb-8 lg:pb-10">
      <Container className="md:flex gap-5">
        <div className="md:w-[calc(50%-10px)]">
          <ImagePicker
            photos={gallery}
            productTitle={currentProduct.title}
            isOverlayShown={isReadPassageShown}
          />
          <div className="hidden md:block">
            <Reviews
              reviews={reviews}
              action={<WriteReview currentProduct={currentProduct} />}
            />
          </div>
        </div>
        <div className="md:w-[calc(50%-10px)]">
          <ProductDetails currentProduct={currentProduct} />
          <OrderProduct
            currentProduct={currentProduct}
            count={count}
            setCount={setCount}
          />
          {(!!description || !!bookScreens) && (
            <div className="flex flex-col gap-4 lg:gap-6 py-4 lg:py-6">
              {!!description && <Description description={description} />}
              {!!bookScreens && (
                <ReadPassage
                  bookScreens={bookScreens}
                  currentProduct={currentProduct}
                  count={count}
                  isModalShown={isReadPassageShown}
                  setIsModalShown={setIsReadPassageShown}
                />
              )}
            </div>
          )}
          {!!features && <Features features={features} />}
          <div className="md:hidden">
            <Reviews
              reviews={reviews}
              action={<WriteReview currentProduct={currentProduct} />}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
