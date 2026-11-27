import "server-only";
import { listProducts } from "@/entities/product/lib/listProducts";
import { ListingParams } from "@/entities/product/lib/listingParams";
import { getProductsBySeries } from "@/entities/product/api/getProducts";
import { decodePathParam } from "@/shared/lib/routing/decodePathParam";
import { getSeriesHref } from "@/entities/product/lib/getSeriesInfo";
import { CollectionViewProps } from "../ui/CollectionView";

/* Props of a series page, or null when the series has no products. */
export const loadSeriesView = async (
  seriesParam: string,
  params: ListingParams
): Promise<CollectionViewProps | null> => {
  const seriesName = decodePathParam(seriesParam);
  if (!seriesName) return null;

  const products = await getProductsBySeries(seriesName);
  if (!products.length) return null;

  return {
    title: `Серія «${seriesName}»`,
    pathname: getSeriesHref(seriesName),
    listing: listProducts(products, params, "series"),
  };
};
