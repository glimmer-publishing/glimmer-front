import type { Product } from "@/entities/product/model/product";

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
