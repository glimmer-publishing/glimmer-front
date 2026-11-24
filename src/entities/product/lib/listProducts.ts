import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { ListingParams } from "../model/listingParams";
import { FILTER_OPTIONS, SORT_OPTION_SETS } from "../model/constants";
import { Product } from "@/types/product";
import {
  ListingOption,
  ListingPage,
  ProductListing,
  SortSet,
} from "../model/types";
import { filterProducts } from "./filterProducts";
import { sortProducts } from "./sortProducts";

// The first option of each list is its default.
const pickOption = (options: ListingOption[], value: string | undefined) =>
  (options.find((option) => option.value === value) ?? options[0]).value;

// undefined for the default, so links leave it out.
const unlessDefault = (options: ListingOption[], value: string) =>
  value === options[0].value ? undefined : value;

const paginate = (products: Product[], requestedPage = 1): ListingPage => {
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
};

export const listProducts = (
  products: Product[],
  params: ListingParams,
  sortSet: SortSet = "default"
): ProductListing => {
  const sortOptions = SORT_OPTION_SETS[sortSet];
  const filter = pickOption(FILTER_OPTIONS, params.filter);
  const sort = pickOption(sortOptions, params.sort);
  const listed = sortProducts(filterProducts(products, filter), sort);
  const page = paginate(listed, params.page);

  return {
    page,
    totalCount: listed.length,
    filter,
    sort,
    sortSet,
    params: {
      filter: unlessDefault(FILTER_OPTIONS, filter),
      sort: unlessDefault(sortOptions, sort),
      page: page.currentPage,
    },
  };
};
