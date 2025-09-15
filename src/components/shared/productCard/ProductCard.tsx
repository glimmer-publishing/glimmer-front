"use client";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import CartButton from "./CartButton";
import FavoriteButton from "./FavoriteButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    mainImage,
    slug,
    title,
    author,
    isBestseller,
    isNew,
    price,
    discountPrice,
    categorySlug,
    status,
  } = product;

  return (
    <div className="flex flex-col pb-3 rounded-[10px]">
      <div className="relative flex items-center justify-between px-2 mb-2 lg:mb-[14px] h-[25px]">
        <div className="absolute top-[1px] left-0 z-10 flex flex-col gap-1">
          {isBestseller ? (
            <>
              <Image
                src="/images/icons/topMob.svg"
                alt="top icon"
                className="lg:hidden"
                width="106"
                height="20"
              />
              <Image
                src="/images/icons/topDesk.svg"
                alt="top icon"
                className="hidden lg:block"
                width="95"
                height="29"
              />
            </>
          ) : null}
          {isNew ? (
            <>
              <Image
                src="/images/icons/newMob.svg"
                alt="top icon"
                className="lg:hidden"
                width="106"
                height="20"
              />
              <Image
                src="/images/icons/newDesk.svg"
                alt="top icon"
                className="hidden lg:block"
                width="141"
                height="30"
              />
            </>
          ) : null}
          {discountPrice ? (
            <div className="relative">
              <Image
                src="/images/icons/promoMob.svg"
                alt="top icon"
                className="lg:hidden"
                width="106"
                height="20"
              />
              <Image
                src="/images/icons/promoDesk.svg"
                alt="top icon"
                className="hidden lg:block"
                width="109"
                height="29"
              />
              <div className="absolute left-0 -bottom-[22px] lg:-bottom-[30px] z-10 p-0.5 lg:p-1 text-[12px] lg:text-[15px] font-semibold leading-[120%] text-white bg-accent rounded-[6px]">
                {Math.round(((discountPrice - price) / price) * 100)}%
              </div>
            </div>
          ) : null}{" "}
        </div>
        <FavoriteButton currentProduct={product} className="ml-auto" />
      </div>
      <Link
        href={`/catalog/${categorySlug}/${slug}`}
        className="group relative block w-full h-[197px] lg:h-[275px] mb-2 lg:mb-3"
      >
        <Image
          src={mainImage || ""}
          alt={title}
          fill
          className="object-contain will-change-transform xl:group-hover:scale-[105%] transition duration-700 ease-in-out"
        />
      </Link>
      <Link
        href={`/catalog/${categorySlug}/${slug}`}
        className="group block mb-2 lg:mb-[14px] px-2"
      >
        <p
          className="mb-2 text-[10px] lg:text-[12px] font-light leading-[120%] opacity-60 line-clamp-1 xl:group-hover:text-main
         group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out"
        >
          {author}
        </p>
        <p
          className="min-h-[29px] lg:min-h-[34px] text-[12px] lg:text-[14px] font-medium leading-[120%] line-clamp-2 xl:group-hover:text-main
         group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out"
        >
          {title}
        </p>
      </Link>
      <div className="px-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        {discountPrice && discountPrice < price ? (
          <div className="lg:flex flex-col-reverse shrink-0">
            <span className="text-[15px] lg:text-[16px] font-semibold leading-[120%] text-accent">
              {discountPrice} грн
            </span>
            <span className="inline-block ml-2 lg:ml-0 text-[12px] lg:text-[14px] font-light leading-[120%] line-through">
              {price} грн
            </span>
          </div>
        ) : (
          <div className="inline-block mb-[3.5px] text-[12px] lg:text-[14px] font-semibold shrink-0">
            {price} грн
          </div>
        )}
        <CartButton status={status} product={product} />
      </div>
    </div>
  );
}
