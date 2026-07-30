"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { allRecommendedProductsQuery } from "@/lib/queries";
import { useCartStore } from "@/store/cartStore";
import { fetchSanityDataClient } from "@/utils/fetchSanityDataClient";
import { getProductGenreSlugs } from "@/utils/getProductGenreSlugs";
import { trackAddToCart } from "@/utils/ecommerceTracking";
import { Product } from "@/types/product";
import CheckoutSubTitle from "./CheckoutSubtitle";
import MainButton from "../../buttons/MainButton";
import CartIcon from "../../icons/CartIcon";

const MAX_RECOMMENDED = 2;

export default function RecommendedProducts() {
  const { cart, addToCart } = useCartStore();
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);

  const firstCartProduct = cart[0]?.product;
  const currentSlug = firstCartProduct?.slug;
  const genreSlugs = useMemo(
    () => getProductGenreSlugs(firstCartProduct),
    [firstCartProduct]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!genreSlugs.length || !currentSlug) return;

    const cartProductIds = new Set(cart.map((item) => item.product.id));

    const loadRecommended = async () => {
      try {
        const products: Product[] = await fetchSanityDataClient(
          allRecommendedProductsQuery,
          { genreSlugs, currentSlug }
        );

        setRecommendedProducts(
          products.filter((product) => !cartProductIds.has(product.id))
        );
      } catch (error) {
        console.error("Sanity fetch failed:", error);
      }
    };

    loadRecommended();
  }, [genreSlugs, currentSlug, cart]);

  if (!recommendedProducts.length) return null;

  return (
    <div className="py-3 px-2.5 md:p-6 mt-6 rounded-[12px] bg-main/40">
      <CheckoutSubTitle>Рекомендовані товари</CheckoutSubTitle>
      <ul className="flex flex-col gap-4">
        {recommendedProducts.slice(0, MAX_RECOMMENDED).map((product) => (
          <RecommendedItem
            key={product.id}
            product={product}
            showPrice={isClient}
            onAddToCart={() => {
              addToCart(product, 1);
              trackAddToCart(product, 1);
            }}
          />
        ))}
      </ul>
    </div>
  );
}

interface RecommendedItemProps {
  product: Product;
  showPrice: boolean;
  onAddToCart: () => void;
}

function RecommendedItem({
  product,
  showPrice,
  onAddToCart,
}: RecommendedItemProps) {
  const productHref = `/catalog/${product.categorySlug}/${product.slug}`;

  return (
    <li className="flex gap-2 p-3 bg-white rounded-[12px]">
      <Link
        href={productHref}
        className="group relative w-[54px] lg:w-[70px] h-[70px] lg:h-[91px] rounded-[8px]"
      >
        <Image
          src={product.mainImage}
          alt={product.title}
          fill
          className="object-cover xl:group-hover:scale-105 will-change-transform transition duration-700 ease-in-out"
        />
      </Link>
      <div className="flex flex-col justify-between w-full">
        <Link href={productHref} className="group mb-2">
          <p
            className="mb-1 text-[12px] lg:text-[15px] font-medium leading-[120%] xl:group-hover:text-main 
            group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out"
          >
            {product.title}
          </p>
          {product.author ? (
            <p
              className="text-[10px] lg:text-[12px] font-light leading-[120%] xl:group-hover:text-main 
              group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out"
            >
              {product.author}
            </p>
          ) : null}
        </Link>
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="text-[13px] xl:text-[16px] font-semibold leading-[120%]">
            {showPrice ? <ProductPrice product={product} /> : null}
          </div>
          <MainButton
            onClick={onAddToCart}
            className="w-[130px] md:w-[50px] lg:w-[149px] h-7 text-[10px] lg:text-[12px] font-medium leading-none"
          >
            <span className="md:hidden lg:block">Додати до кошика</span>
            <CartIcon className="hidden md:block lg:hidden" />
          </MainButton>
        </div>
      </div>
    </li>
  );
}

function ProductPrice({ product }: { product: Product }) {
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;

  if (!hasDiscount) {
    return (
      <p className="text-[12px] lg:text-[15px] font-semibold leading-[120%]">
        {product.price} грн
      </p>
    );
  }

  const discountPercent = Math.round(
    ((product.discountPrice! - product.price) / product.price) * 100
  );

  return (
    <div className="flex flex-col">
      <span className="text-[10px] lg:text-[12px] font-light leading-none line-through">
        {product.price} грн
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[12px] lg:text-[15px] font-semibold leading-none text-accent">
          {product.discountPrice}&nbsp;грн
        </span>
        <span className="p-1 text-[10px] lg:text-[12px] font-semibold leading-none text-white bg-accent rounded-[6px]">
          {discountPercent}%
        </span>
      </div>
    </div>
  );
}
