import { STATIC_CATEGORIES } from "@/constants/category";
import { FILTER_OPTIONS } from "@/constants/filter";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { SERIES_SORT_OPTIONS, SORT_OPTIONS } from "@/constants/sort";
import {
  allProductsByCategoryQuery,
  productsByAuthorQuery,
  productsBySeriesQuery,
  STATIC_CATEGORY_QUERIES,
} from "@/lib/queries";
import { Product } from "@/types/product";
import {
  CatalogBannerData,
  CatalogBooks,
  CatalogPage,
  CatalogQuery,
  CatalogSubcategory,
  CategoryBooks,
  SelectOption,
  StaticCategorySlug,
} from "@/types/catalog";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { filterProducts } from "@/utils/filterProducts";
import { SERIES_FEATURE } from "@/utils/getSeriesInfo";
import { sortProducts } from "@/utils/sortProducts";

interface CategoryData {
  categoryTitle?: string;
  categorySlug?: string;
  genres?: CatalogSubcategory[];
  allProducts?: Product[];
  catalogBanner?: CatalogBannerData | null;
}

// Every Sanity read throws on error, so an outage shows an error page rather
// than a null here, which the pages would turn into a false 404.
export class CatalogService {
  static async getAuthorBooks(
    authorName: string,
    query: CatalogQuery = {}
  ): Promise<CatalogBooks | null> {
    const products: Product[] | null = await fetchSanityDataServer(
      productsByAuthorQuery,
      { authorName }
    );

    if (!products?.length) return null;

    return this.listBooks(products, query);
  }

  static async getSeriesBooks(
    seriesName: string,
    query: CatalogQuery = {}
  ): Promise<CatalogBooks | null> {
    const products: Product[] | null = await fetchSanityDataServer(
      productsBySeriesQuery,
      { seriesName, seriesFeature: SERIES_FEATURE }
    );

    if (!products?.length) return null;

    return this.listBooks(products, query, SERIES_SORT_OPTIONS);
  }

  static async getCategoryBooks(
    categorySlug: string,
    query: CatalogQuery = {}
  ): Promise<CategoryBooks | null> {
    const staticSlug = this.toStaticSlug(categorySlug);
    const staticCategory = staticSlug && STATIC_CATEGORIES[staticSlug];

    const data: CategoryData | null = staticSlug
      ? await fetchSanityDataServer(STATIC_CATEGORY_QUERIES[staticSlug])
      : await fetchSanityDataServer(allProductsByCategoryQuery, {
          categorySlug,
        });

    if (!staticCategory && !data?.categorySlug) return null;

    const subcategory = this.pickSubcategory(data?.genres, query.subcategory);

    return {
      ...this.listBooks(
        subcategory?.products ?? data?.allProducts ?? [],
        query
      ),
      title: staticCategory?.title ?? data?.categoryTitle ?? "",
      subcategories: data?.genres,
      activeSubcategory: subcategory?.genreSlug,
      banner: data?.catalogBanner ?? undefined,
      emptyMessage: staticCategory?.emptyMessage,
    };
  }

  private static listBooks(
    products: Product[],
    query: CatalogQuery,
    sortOptions: SelectOption[] = SORT_OPTIONS
  ): CatalogBooks {
    const filter = this.pickOption(FILTER_OPTIONS, query.filter);
    const sort = this.pickOption(sortOptions, query.sort);
    const listed = sortProducts(filterProducts(products, filter), sort);

    return {
      page: this.paginate(listed, query.page),
      totalCount: listed.length,
      filter,
      sort,
      sortOptions,
    };
  }

  // Own keys only, so "constructor" or "toString" is not a static category.
  private static toStaticSlug(slug: string): StaticCategorySlug | undefined {
    return Object.keys(STATIC_CATEGORIES).includes(slug)
      ? (slug as StaticCategorySlug)
      : undefined;
  }

  private static pickOption(
    options: SelectOption[],
    value: string | undefined
  ): string {
    // The first option of each list is its default.
    return (options.find((option) => option.value === value) ?? options[0])
      .value;
  }

  // An unknown slug returns undefined on purpose: the whole category is shown.
  // The product breadcrumb can link to a genre the category lacks.
  private static pickSubcategory(
    subcategories: CatalogSubcategory[] | undefined,
    slug: string | undefined
  ): CatalogSubcategory | undefined {
    if (!subcategories?.length) return undefined;
    if (!slug) return subcategories[0];

    return subcategories.find((subcategory) => subcategory.genreSlug === slug);
  }

  private static paginate(products: Product[], requestedPage = 1): CatalogPage {
    const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);

    return {
      products: products.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
      currentPage,
      totalPages,
    };
  }
}
