import type { TrackedItem } from "@/utils/ecommerceTracking";
import type { PricedLine } from "../model/types";

/* Priced lines as analytics items, in hryvnia. */
export const toTrackedItems = (lines: PricedLine[]): TrackedItem[] =>
  lines.map((line) => ({
    id: line.id,
    title: line.title,
    category: line.categoryTitle || line.categorySlug || "",
    price: line.unitPrice / 100,
    quantity: line.quantity,
  }));
