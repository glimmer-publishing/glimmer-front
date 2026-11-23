import { SelectOption } from "@/types/catalog";

// Values must match the cases in sortProducts.ts. The first is the default.
export const SORT_OPTIONS: SelectOption[] = [
  { title: "За найвищим рейтингом", value: "rating" },
  { title: "За збільшенням ціни", value: "price-ascending" },
  { title: "За зменшенням ціни", value: "price-descending" },
];

export const SERIES_SORT_OPTIONS: SelectOption[] = [
  { title: "За порядком у серії", value: "series" },
  ...SORT_OPTIONS,
];
