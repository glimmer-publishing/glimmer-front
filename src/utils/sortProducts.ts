import { Product } from "@/types/product";
import { getAverageRating } from "./getAverageRating";

export function sortProducts(products: Product[], sort: string): Product[] {
  const items = [...products];

  const getFinalPrice = (product: Product) =>
    product.discountPrice ?? product.price ?? 0;

  switch (sort) {
    case "price-ascending":
      return items.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
    case "price-descending":
      return items.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
    case "rating":
      return items.sort(
        (a, b) => getAverageRating(b.reviews) - getAverageRating(a.reviews)
      );
    case "default":
    default:
      return items;
  }
}
