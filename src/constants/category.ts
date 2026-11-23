import { StaticCategory, StaticCategorySlug } from "@/types/catalog";

// Slugs that are not Sanity categories: they have their own query (see
// STATIC_CATEGORY_QUERIES) and title, and no genre tabs.
export const STATIC_CATEGORIES: Record<StaticCategorySlug, StaticCategory> = {
  promo: { title: "Акції" },
  all: {
    title: "Весь каталог",
    emptyMessage: "За обраним фільтром товарів не знайдено",
  },
};
