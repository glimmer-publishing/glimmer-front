import { CatalogItem } from "../model/catalogItem";
import { categoryPageHref } from "@/entities/category/lib/categoryParams";
import { STATIC_CATEGORIES } from "@/entities/category/model/constants";
import type { MenuCategory } from "@/entities/category/model/types";

/**
 * The static selections ("Акції", "Весь каталог"), first in the catalog menu.
 * "Весь каталог" lists books and stationery together, with no genre chips.
 */
const staticItems: CatalogItem[] = Object.entries(STATIC_CATEGORIES).map(
  ([slug, { title }]) => ({ slug, title, href: categoryPageHref(slug) })
);

/**
 * Категорія з жанрами не показується в меню окремим пунктом — замість неї
 * виводяться її жанри, щоб каталог залишався одного рівня.
 */
export function buildCatalogList(
  categories: MenuCategory[] = []
): CatalogItem[] {
  const items = [...categories]
    .sort((a, b) => a.order - b.order)
    .flatMap((category) =>
      category.genres && category.genres.length > 0
        ? category.genres.map((genre) => ({
            slug: genre.slug,
            title: genre.title,
            href: categoryPageHref(category.slug, genre.slug),
          }))
        : [
            {
              slug: category.slug,
              title: category.title,
              href: categoryPageHref(category.slug),
            },
          ]
    );

  return [...staticItems, ...items];
}
