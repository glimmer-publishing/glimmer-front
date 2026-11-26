import "server-only";
import { getRecommendations } from "@/entities/product/api/getRecommendations";
import { categoryPageHref } from "@/shared/lib/searchParams/categoryParams";
import { getProductBySlug } from "@/entities/product/api/getProducts";

/**
 * The product page's data, or null for an unknown slug. Recommendations are
 * the book's curated picks, then books sharing one of its genres; a Sanity
 * failure there only empties the section.
 */
export const loadProductView = async (slug: string) => {
  const product = await getProductBySlug(slug);
  if (!product) return null;

  const { categorySlug, categoryTitle, genreTitle, genreSlug, title } = product;

  const crumbs = [
    { label: "Головна", href: "/" },
    {
      label: genreTitle ? `${categoryTitle} - ${genreTitle}` : categoryTitle,
      href: categoryPageHref(categorySlug, genreSlug ?? undefined),
    },
    { label: title, href: product.slug },
  ];

  const recommended = await getRecommendations(
    [slug],
    product.genres?.map((genre) => genre.slug) ?? []
  );

  return { product, crumbs, recommended };
};

/* Everything a product page renders. */
export type ProductViewData = NonNullable<
  Awaited<ReturnType<typeof loadProductView>>
>;
