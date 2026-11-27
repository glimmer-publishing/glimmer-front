import { Product } from "../model/product";
import { getDiscount } from "@/shared/lib/price/getDiscount";

/**
 * The products matching one FILTER_OPTIONS value; an unknown value keeps them
 * all.
 */
export function filterProducts(products: Product[], filter: string): Product[] {
  switch (filter) {
    case "bestseller":
      return products.filter((p) => p.isBestseller);
    case "new":
      return products.filter((p) => p.isNew);
    case "discount":
      return products.filter((p) => getDiscount(p).hasDiscount);
    case "pre-order":
      return products.filter((p) => p.status === "preOrder");
    case "in-stock":
      return products.filter((p) => p.status === "inStock");
    case "all":
    default:
      return products;
  }
}
