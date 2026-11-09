import { Product } from "@/types/product";
import { getAverageRating } from "./getAverageRating";
import { getSeriesInfo } from "./getSeriesInfo";

function compareBySeriesPosition(a: Product, b: Product): number {
  const positionA = getSeriesInfo(a.features)?.position;
  const positionB = getSeriesInfo(b.features)?.position;

  if (positionA !== undefined && positionB !== undefined) {
    return positionA - positionB || a.title.localeCompare(b.title, "uk");
  }
  if (positionA !== undefined) return -1;
  if (positionB !== undefined) return 1;

  return a.title.localeCompare(b.title, "uk");
}

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
    case "series":
      return items.sort(compareBySeriesPosition);
    case "default":
    default:
      return items;
  }
}
