import type { TrackedItem } from "@/shared/lib/analytics/ecommerceTracking";
import type { Product } from "../model/product";

/* A product as analytics sees it: its catalog price, in hryvnia. */
export const toTrackedItem = (
  product: Product,
  quantity: number
): TrackedItem => ({
  id: product.id,
  title: product.title,
  category: product.categoryTitle || product.categorySlug || "",
  price: product.discountPrice ?? product.price,
  quantity,
});
