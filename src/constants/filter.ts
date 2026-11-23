import { SelectOption } from "@/types/catalog";

// Values must match the cases in filterProducts.ts.
export const FILTER_OPTIONS: SelectOption[] = [
  { title: "Всі товари", value: "all" },
  { title: "Хіти продажу", value: "bestseller" },
  { title: "Новинки", value: "new" },
  { title: "Акція", value: "discount" },
  { title: "Передзамовлення", value: "pre-order" },
  { title: "В наявності", value: "in-stock" },
];
