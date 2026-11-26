import type { TrackedItem } from "@/shared/lib/analytics/ecommerceTracking";
import type { PricedLine } from "../model/types";
import { toHryvnia } from "./money";

/* Priced lines as analytics items, in hryvnia. */
export const toTrackedItems = (lines: PricedLine[]): TrackedItem[] =>
  lines.map((line) => ({
    id: line.id,
    title: line.title,
    category: line.categoryTitle || line.categorySlug || "",
    price: toHryvnia(line.unitPrice),
    quantity: line.quantity,
  }));
