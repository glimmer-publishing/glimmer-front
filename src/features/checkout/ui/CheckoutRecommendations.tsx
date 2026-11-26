"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/entities/cart/model/store";
import type { PricedLine } from "@/entities/cart/model/types";
import { useCartRecommendations } from "@/entities/product/api/useCartRecommendations";
import { trackAddToCart } from "@/utils/ecommerceTracking";
import { Product } from "@/types/product";
import MainButton from "@/shared/ui/main-button/MainButton";
import CartIcon from "@/shared/ui/icons/CartIcon";
import CheckoutSubTitle from "./CheckoutSubtitle";

const MAX_RECOMMENDED = 2;

interface CheckoutRecommendationsProps {
  /* The cart as the server priced it. */
  lines: PricedLine[];
}

/**
 * Up to two products to add from checkout: the cart products' curated picks
 * first, then books sharing a genre with the first cart product.
 */
export default function CheckoutRecommendations({
  lines,
}: CheckoutRecommendationsProps) {
  const addItem = useCartStore((state) => state.addItem);

  /**
   * Keyed on the slugs themselves, so changing a quantity does not look
   * like a new set of products and refetch.
   */
  const slugsKey = lines.map((line) => line.slug).join("\n");
  const genresKey = lines[0]?.genreSlugs.join("\n") ?? "";
  const slugs = useMemo(
    () => (slugsKey ? slugsKey.split("\n") : []),
    [slugsKey]
  );
  const genreSlugs = useMemo(
    () => (genresKey ? genresKey.split("\n") : []),
    [genresKey]
  );

  const { data: recommended = [] } = useCartRecommendations(slugs, genreSlugs);

  /**
   * Filtered at render rather than at fetch time, so adding a suggestion
   * removes it immediately instead of triggering a refetch.
   */
  const visibleProducts = useMemo(() => {
    const inCart = new Set(lines.map((line) => line.id));
    return recommended
      .filter((product) => !inCart.has(product.id))
      .slice(0, MAX_RECOMMENDED);
  }, [recommended, lines]);

  if (!visibleProducts.length) return null;

  return (
    <div className="py-3 px-2.5 md:p-6 mt-6 rounded-[12px] bg-main/40">
      <CheckoutSubTitle>Рекомендовані товари</CheckoutSubTitle>
      <ul className="flex flex-col gap-4">
        {visibleProducts.map((product) => (
          <RecommendedItem
            key={product.id}
            product={product}
            onAddToCart={() => {
              addItem(product.id, 1);
              trackAddToCart(product, 1);
            }}
          />
        ))}
      </ul>
    </div>
  );
}

interface RecommendedItemProps {
  /* The suggested product. */
  product: Product;
  /* Adds it to the cart. */
  onAddToCart: () => void;
}

/**
 * One suggestion: cover, title, catalog price and an add button.
 */
function RecommendedItem({ product, onAddToCart }: RecommendedItemProps) {
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
          sizes="70px"
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
          {!!product.author && (
            <p
              className="text-[10px] lg:text-[12px] font-light leading-[120%] xl:group-hover:text-main 
              group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out"
            >
              {product.author}
            </p>
          )}
        </Link>
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="text-[13px] xl:text-[16px] font-semibold leading-[120%]">
            <ProductPrice product={product} />
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

interface ProductPriceProps {
  /* The product whose catalog price is shown. */
  product: Product;
}

/**
 * Catalog price, with the struck-through original when discounted.
 */
function ProductPrice({ product }: ProductPriceProps) {
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
