"use client";

import { useEffect, useState } from "react";
import { allRecommendedProductsQuery } from "@/lib/queries";
import { useCartStore } from "@/store/cartStore";
import CheckoutSubTitle from "./CheckoutSubtitle";
import { fetchSanityDataClient } from "@/utils/fetchSanityDataClient";
import { Product } from "@/types/product";
import Image from "next/image";
import MainButton from "../../buttons/MainButton";
import Link from "next/link";
import CartIcon from "../../icons/CartIcon";
import { sendGTMEvent } from "@next/third-parties/google";

export default function RecommendedProducts() {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const { cart, addToCart } = useCartStore();

  const firstCartProduct = cart[0]?.product;
  const genreSlug = firstCartProduct?.genreSlug;
  const slug = firstCartProduct?.slug;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!genreSlug || !slug) return;

    const loadData = async () => {
      try {
        const products = await fetchSanityDataClient(
          allRecommendedProductsQuery,
          {
            genreSlug,
            currentSlug: slug,
          }
        );
        // Фільтруємо товари, які вже є в кошику
        const filteredProducts = products.filter(
          (product: Product) =>
            !cart.some((cartItem) => cartItem.product.id === product.id)
        );

        setRecommendedProducts(filteredProducts);
      } catch (error) {
        console.error("Sanity fetch failed:", error);
      }
    };

    loadData();
  }, [genreSlug, slug, cart]);

  if (!recommendedProducts?.length) return null;

  const shownRecommendedProducts = recommendedProducts?.slice(0, 2);

  return (
    <div className="py-3 px-2.5 md:p-6 mt-6 rounded-[12px] bg-main/40">
      <CheckoutSubTitle>Рекомендовані товари</CheckoutSubTitle>
      <ul className="flex flex-col gap-4">
        {shownRecommendedProducts.map((product, idx) => (
          <li
            key={product.id || idx}
            className="flex gap-2 p-3 bg-white rounded-[12px]"
          >
            <div className="relative w-[54px] lg:w-[70px] h-[70px] lg:h-[91px] rounded-[8px]">
              <Link
                href={`/catalog/${product.categorySlug}/${slug}`}
                className="group"
              >
                <Image
                  src={product.mainImage}
                  alt={product.title}
                  fill
                  className="object-cover xl:group-hover:scale-105 will-change-transform transition duration-700 ease-in-out"
                />
              </Link>
            </div>
            <div className="flex flex-col justify-between w-full">
              <Link
                href={`/catalog/${product.categorySlug}/${product.slug}`}
                className="group"
              >
                <div className="mb-2">
                  <p
                    className="mb-1 text-[12px] lg:text-[15px] font-medium leading-[120%] xl:group-hover:text-main 
                    group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out"
                  >
                    {product.title}
                  </p>
                  {product.author ? (
                    <p
                      className="text-[10px] lg:text-[12px] font-light leading-[120%]  xl:group-hover:text-main 
                      group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out"
                    >
                      {product.author}
                    </p>
                  ) : null}
                </div>
              </Link>
              <div className="flex justify-between items-center gap-2 w-full">
                <div
                  className={`text-[13px] xl:text-[16px] font-semibold leading-[120%]`}
                >
                  {isClient &&
                    (product.discountPrice &&
                    product.discountPrice < product.price ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] lg:text-[12px] font-light leading-none line-through">
                          {product.price} грн
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] lg:text-[15px] font-semibold leading-none text-accent">
                            {product.discountPrice}&nbsp;грн
                          </span>
                          <span className="p-1 text-[10px] lg:text-[12px] font-semibold leading-none text-white bg-accent rounded-[6px]">
                            {Math.round(
                              ((product.discountPrice - product.price) /
                                product.price) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[12px] lg:text-[15px] font-semibold leading-[120%]">
                        {product.price} грн
                      </p>
                    ))}
                </div>
                <MainButton
                  onClick={() => {
                    addToCart(product, 1);
                    sendGTMEvent({ event: "AddToCart" });
                  }}
                  className="w-[130px] md:w-[50px] lg:w-[149px] h-7 text-[10px] lg:text-[12px] font-medium leading-none"
                >
                  <span className="md:hidden lg:block">Додати до кошика</span>
                  <CartIcon className="hidden md:block lg:hidden" />
                </MainButton>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
