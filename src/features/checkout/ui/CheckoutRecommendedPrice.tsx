import type { Product } from "@/entities/product/model/product";
import { getDiscount } from "@/shared/lib/price/getDiscount";

type CheckoutRecommendedPriceProps = {
  /* The product whose catalog price is shown. */
  product: Product;
};

/**
 * Catalog price, with the struck-through original when discounted.
 */
export default function CheckoutRecommendedPrice({
  product,
}: CheckoutRecommendedPriceProps) {
  const { hasDiscount, currentPrice, percent } = getDiscount(product);

  if (!hasDiscount) {
    return (
      <p className="text-[12px] lg:text-[15px] font-semibold leading-[120%]">
        {product.price} грн
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-[10px] lg:text-[12px] font-light leading-none line-through">
        {product.price} грн
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[12px] lg:text-[15px] font-semibold leading-none text-accent">
          {currentPrice}&nbsp;грн
        </span>
        <span className="p-1 text-[10px] lg:text-[12px] font-semibold leading-none text-white bg-accent rounded-[6px]">
          {percent}%
        </span>
      </div>
    </div>
  );
}
