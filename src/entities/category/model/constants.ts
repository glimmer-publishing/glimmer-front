import type { ProductSelection } from "@/entities/product/model/types";

/* A product selection shown like a category: its title and which products. */
export type StaticCategory = {
  title: string;
  emptyMessage?: string;
  selection: ProductSelection;
};

/**
 * Slugs under /catalog that are not Sanity categories: their own products
 * and title, and no genre tabs. The header menu lists them first, in this
 * order.
 */
export const STATIC_CATEGORIES = {
  promo: { title: "Акції", selection: "discounted" },
  all: {
    title: "Весь каталог",
    emptyMessage: "За обраним фільтром товарів не знайдено",
    selection: "all",
  },
} as const satisfies Record<string, StaticCategory>;

/**
 * The fiction category: the home page's genres all belong to it, and only
 * its books go to the Google Merchant feed.
 */
export const FICTION_CATEGORY_SLUG = "khudozhnya-literatura";
