"use client";
import { Product } from "@/types/product";
import { useEffect } from "react";
import { useReviewedProductsStore } from "@/store/reviewedProductsStore";
import Container from "@/components/shared/container/Container";
import OrderProduct from "./OrderProduct";
import ImagePicker from "./ImagePicker";
import Description from "./Description";
import ReadPassage from "./ReadPassage";
import Features from "./Features";
import Reviews from "./Reviews";
import ProductDetails from "./ProductDetails";

interface ProductInfoProps {
  currentProduct: Product;
}

export default function ProductInfo({ currentProduct }: ProductInfoProps) {
  const { addReviewedProduct } = useReviewedProductsStore();

  const { description, bookScreens, features, reviews, gallery } =
    currentProduct;

  useEffect(() => {
    if (currentProduct) {
      addReviewedProduct(currentProduct);
    }
  }, [currentProduct, addReviewedProduct]);

  return (
    <section className="pb-8 lg:pb-10">
      <Container className="md:flex gap-5">
        <div className="md:w-[calc(50%-10px)]">
          <ImagePicker photos={gallery} />
          <div className="hidden md:block">
            <Reviews reviews={reviews} currentProduct={currentProduct} />
          </div>
        </div>
        <div className="md:w-[calc(50%-10px)]">
          <ProductDetails currentProduct={currentProduct} />
          <OrderProduct currentProduct={currentProduct} />
          {description || bookScreens ? (
            <div className="flex flex-col gap-4 lg:gap-6 py-4 lg:py-6">
              {description ? <Description description={description} /> : null}
              {bookScreens ? (
                <ReadPassage
                  bookScreens={bookScreens}
                  currentProduct={currentProduct}
                />
              ) : null}
            </div>
          ) : null}
          {features ? <Features features={features} /> : null}
          <div className="md:hidden">
            <Reviews reviews={reviews} currentProduct={currentProduct} />
          </div>
        </div>
      </Container>
    </section>
  );
}
