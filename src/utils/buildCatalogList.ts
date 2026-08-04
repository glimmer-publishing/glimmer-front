import { CatalogItem } from "@/types/catalogItem";
import { Category } from "@/types/category";

const promoItem: CatalogItem = {
  slug: "promo",
  title: "Акції",
  href: "/catalog/promo",
};

// Категорія з жанрами не показується в меню окремим пунктом — замість неї
// виводяться її жанри, щоб каталог залишався одного рівня.
export function buildCatalogList(categories: Category[] = []): CatalogItem[] {
  const items = [...categories]
    .sort((a, b) => a.order - b.order)
    .flatMap((category) =>
      category.genres && category.genres.length > 0
        ? category.genres.map((genre) => ({
            slug: genre.slug,
            title: genre.title,
            href: `/catalog/${category.slug}?subcategory=${genre.slug}`,
          }))
        : [
            {
              slug: category.slug,
              title: category.title,
              href: `/catalog/${category.slug}`,
            },
          ]
    );

  return [promoItem, ...items];
}
