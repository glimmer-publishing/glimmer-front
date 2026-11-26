"use client";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/shared/lib/formatDate";
import { formatHryvnia } from "@/entities/cart/lib/money";
import type { PricedLine } from "@/entities/cart/model/types";
import QuantityCounter from "@/features/edit-cart/ui/QuantityCounter";
import RemoveFromCart from "@/features/edit-cart/ui/RemoveFromCart";

interface CartLineProps {
  /* The line as the server priced it. */
  line: PricedLine;
  /* Called when a link inside the line is followed, to close the cart modal. */
  onNavigate?: () => void;
}

/**
 * One cart product: cover, title, server price (struck-through base price
 * when discounted), quantity counter and remove button.
 */
export default function CartLine({ line, onNavigate }: CartLineProps) {
  const {
    id,
    slug,
    categorySlug,
    title,
    author,
    mainImage,
    basePrice,
    unitPrice,
    status,
    preOrderShippingDate,
  } = line;

  const href = `/catalog/${categorySlug}/${slug}`;
  const isDiscounted = unitPrice < basePrice;
  const shippingDate =
    status === "preOrder" && preOrderShippingDate
      ? formatDate(preOrderShippingDate)
      : null;

  return (
    <div className="shadow-sm bg-white rounded-[12px] p-2">
      <div className="flex gap-x-2 ">
        <Link onClick={onNavigate} href={href} className="group">
          <div
            className="relative shrink-0 w-[54px] lg:w-[70px] h-[70px] lg:h-[91px] overflow-hidden rounded-[6px] will-change-transform
           xl:group-hover:scale-[103%] transition duration-500 ease-in-out"
          >
            <Image
              src={mainImage}
              alt={"product photo"}
              fill
              sizes="70px"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <div className="w-full flex flex-col gap-2 justify-between">
          <div className="flex gap-3 justify-between">
            <Link onClick={onNavigate} href={href} className="group">
              <p
                className={`mb-1 text-[12px] lg:text-[15px] font-medium leading-[120%] line-clamp-2 xl:group-hover:text-main
                  group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out`}
              >
                {title}
              </p>
              {!!author && (
                <p
                  className="text-[10px] lg:text-[12px] font-light leading-[120%] text-black/60 xl:group-hover:text-main
                  group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out"
                >
                  {author}
                </p>
              )}
            </Link>
            <RemoveFromCart id={id} className="size-6 ml-auto shrink-0" />
          </div>
          <div className="flex gap-2 justify-between">
            <div className="text-[13px] xl:text-[16px] font-semibold leading-[120%]">
              {isDiscounted && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] lg:text-[12px] font-light leading-[120%] line-through">
                    {formatHryvnia(basePrice)} грн
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] lg:text-[15px] font-semibold leading-[120%] text-accent">
                      {formatHryvnia(unitPrice)}&nbsp;грн
                    </span>
                    <span className="p-1 text-[10px] lg:text-[12px] font-semibold leading-[120%] text-white bg-accent rounded-[6px]">
                      {Math.round(((unitPrice - basePrice) / basePrice) * 100)}%
                    </span>
                  </div>
                </div>
              )}
              {!isDiscounted && (
                <p className="text-[12px] lg:text-[15px] font-semibold leading-[120%]">
                  {formatHryvnia(unitPrice)} грн
                </p>
              )}
            </div>
            <QuantityCounter id={id} />
          </div>
        </div>
      </div>
      {!!shippingDate && (
        <p className="mt-1 mr-2 text-[8px] font-normal leading-[120%] text-accent text-right">
          Відправка з {shippingDate}
        </p>
      )}
    </div>
  );
}
