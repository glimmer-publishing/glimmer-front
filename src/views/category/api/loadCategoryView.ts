import "server-only";
import type { CategoryGenre } from "@/entities/category/model/types";
import { getCategory } from "@/entities/category/api/getCategory";
import { ListingParams } from "@/entities/product/model/listingParams";
import { listProducts } from "@/entities/product/lib/listProducts";
import { ProductSelection } from "@/entities/product/model/types";
import { getProductSelection } from "@/entities/product/api/getProducts";
import { CategoryParams } from "../model/categoryParams";
import { CategoryViewProps } from "../ui/CategoryView";

interface StaticCategory {
  title: string;
  emptyMessage?: string;
  selection: ProductSelection;
}

/**
 * Slugs that are not Sanity categories: their own products and title, and no
 * genre tabs. They still show the catalog banner.
 */
const STATIC_CATEGORIES: Record<string, StaticCategory> = {
  promo: { title: "Акції", selection: "discounted" },
  all: {
    title: "Весь каталог",
    emptyMessage: "За обраним фільтром товарів не знайдено",
    selection: "all",
  },
};

// Own keys only, so "constructor" or "toString" is not a static category.
const getStaticCategory = (slug: string): StaticCategory | undefined =>
  Object.hasOwn(STATIC_CATEGORIES, slug) ? STATIC_CATEGORIES[slug] : undefined;

/**
 * An unknown slug returns undefined on purpose: the whole category is shown.
 * The product breadcrumb can link to a genre the category lacks.
 */
const pickGenre = (
  genres: CategoryGenre[] | undefined,
  slug: string | undefined
): CategoryGenre | undefined => {
  if (!genres?.length) return undefined;
  if (!slug) return genres[0];

  return genres.find((genre) => genre.genreSlug === slug);
};

/* Props of a category page, or null when the slug is no category. */
export const loadCategoryView = async (
  slug: string,
  params: ListingParams,
  { subcategory }: CategoryParams
): Promise<CategoryViewProps | null> => {
  const pathname = `/catalog/${slug}`;
  const staticCategory = getStaticCategory(slug);

  if (staticCategory) {
    const { products, banner } = await getProductSelection(
      staticCategory.selection
    );

    return {
      pathname,
      title: staticCategory.title,
      listing: listProducts(products, params),
      banner,
      emptyMessage: staticCategory.emptyMessage,
    };
  }

  const category = await getCategory(slug);
  if (!category) return null;

  const genre = pickGenre(category.genres, subcategory);

  return {
    pathname,
    subcategory,
    title: category.title,
    listing: listProducts(genre?.products ?? category.products, params),
    genres: category.genres,
    activeGenre: genre?.genreSlug,
    banner: category.banner,
  };
};
