import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/entities/product/model/product";
import MainButton from "@/shared/ui/main-button/MainButton";
import CartIcon from "@/shared/ui/icons/CartIcon";
import CheckoutRecommendedPrice from "./CheckoutRecommendedPrice";

type CheckoutRecommendedItemProps = {
  /* The suggested product. */
  product: Product;
  /* Adds it to the cart. */
  onAddToCart: () => void;
};

/**
 * One suggestion: cover, title, catalog price and an add button.
 */
export default function CheckoutRecommendedItem({
  product,
  onAddToCart,
}: CheckoutRecommendedItemProps) {
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
            <CheckoutRecommendedPrice product={product} />
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
