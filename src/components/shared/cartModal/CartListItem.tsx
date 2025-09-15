import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/types/cartItem";
import Image from "next/image";
import Counter from "./Counter";
import IconButton from "../buttons/IconButton";
import Link from "next/link";
import TrashIcon from "../icons/TrashIcon";
import { formatDate } from "@/utils/formatDate";

interface CartItemProps {
  cartItem: CartItem;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
}

export default function CartListItem({
  cartItem,
  setIsPopUpShown,
}: CartItemProps) {
  const [isClient, setIsClient] = useState(false);

  const { preOrderShippingDate, status } = cartItem?.product;

  const formattedPreOrderShippingDate = preOrderShippingDate
    ? formatDate(preOrderShippingDate)
    : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { removeFromCart, getItemFinalPrice } = useCartStore();

  const {
    author,
    title,
    price,
    discountPrice,
    id,
    mainImage,
    categorySlug,
    slug,
  } = cartItem?.product;

  return (
    <>
      <div className="shadow-sm bg-white rounded-[12px] p-2">
        <div className="flex gap-x-2 ">
          <Link
            onClick={setIsPopUpShown ? () => setIsPopUpShown(false) : undefined}
            href={`/catalog/${categorySlug}/${slug}`}
            className="group"
          >
            <div
              className="relative shrink-0 w-[54px] lg:w-[70px] h-[70px] lg:h-[91px] overflow-hidden rounded-[6px] will-change-transform
           xl:group-hover:scale-[103%] transition duration-500 ease-in-out"
            >
              <Image
                src={mainImage}
                alt={"product photo"}
                fill
                sizes="33vw"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <div className="w-full flex flex-col gap-2 justify-between">
            <div className="flex gap-3 justify-between">
              <Link
                onClick={
                  setIsPopUpShown ? () => setIsPopUpShown(false) : undefined
                }
                href={`/catalog/${categorySlug}/${slug}`}
                className="group"
              >
                <p
                  className={`mb-1 text-[12px] lg:text-[15px] font-medium leading-[120%] line-clamp-2 xl:group-hover:text-main 
                  group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out`}
                >
                  {title}
                </p>
                {author ? (
                  <p
                    className="text-[10px] lg:text-[12px] font-light leading-[120%] text-black/60 xl:group-hover:text-main 
                  group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out"
                  >
                    {author}
                  </p>
                ) : null}
              </Link>
              <IconButton
                handleClick={() => removeFromCart(id)}
                className="size-6 ml-auto shrink-0"
              >
                <TrashIcon />
              </IconButton>
            </div>
            <div className="flex gap-2 justify-between">
              <div
                className={`text-[13px] xl:text-[16px] font-semibold leading-[120%]`}
              >
                {isClient &&
                  ((discountPrice && discountPrice < price) ||
                  getItemFinalPrice(id) < price ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] lg:text-[12px] font-light leading-[120%] line-through">
                        {price} грн
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] lg:text-[15px] font-semibold leading-[120%] text-accent">
                          {getItemFinalPrice(id)}&nbsp;грн
                        </span>
                        <span className="p-1 text-[10px] lg:text-[12px] font-semibold leading-[120%] text-white bg-accent rounded-[6px]">
                          {Math.round(
                            ((getItemFinalPrice(id) - price) / price) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[12px] lg:text-[15px] font-semibold leading-[120%]">
                      {getItemFinalPrice(id)} грн
                    </p>
                  ))}
              </div>
              <Counter cartItem={cartItem} />
            </div>
          </div>
        </div>
        {status === "preOrder" && formattedPreOrderShippingDate ? (
          <p className="mt-1 mr-2 text-[8px] font-normal leading-[120%] text-accent text-right">
            Відправка з {formattedPreOrderShippingDate}
          </p>
        ) : null}
      </div>
    </>
  );
}
