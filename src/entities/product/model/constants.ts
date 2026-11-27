import { ListingOption, SortSet } from "./types";

/* Products per listing page. */
export const ITEMS_PER_PAGE = 24;

// Values must match the cases in lib/filterProducts.ts. The first is the default.
export const FILTER_OPTIONS: ListingOption[] = [
  { title: "Всі товари", value: "all" },
  { title: "Хіти продажу", value: "bestseller" },
  { title: "Новинки", value: "new" },
  { title: "Акція", value: "discount" },
  { title: "Передзамовлення", value: "pre-order" },
  { title: "В наявності", value: "in-stock" },
];

// Values must match the cases in lib/sortProducts.ts. The first is the default.
const SORT_OPTIONS: ListingOption[] = [
  { title: "За найвищим рейтингом", value: "rating" },
  { title: "За збільшенням ціни", value: "price-ascending" },
  { title: "За зменшенням ціни", value: "price-descending" },
];

/* The sort options of each kind of listing. */
export const SORT_OPTION_SETS: Record<SortSet, ListingOption[]> = {
  default: SORT_OPTIONS,
  series: [{ title: "За порядком у серії", value: "series" }, ...SORT_OPTIONS],
};
