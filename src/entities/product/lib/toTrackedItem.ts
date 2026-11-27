import type { TrackedItem } from "@/shared/lib/analytics/ecommerceTracking";
import type { Product } from "../model/product";
import { getDiscount } from "@/shared/lib/price/getDiscount";

/* A product as analytics sees it: its catalog price, in hryvnia. */
export const toTrackedItem = (
  product: Product,
  quantity: number
): TrackedItem => ({
  id: product.id,
  title: product.title,
  category: product.categoryTitle || product.categorySlug || "",
  price: getDiscount(product).currentPrice,
  quantity,
});
