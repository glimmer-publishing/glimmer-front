import "server-only";
import { ListingParams } from "@/entities/product/lib/listingParams";
import { listProducts } from "@/entities/product/lib/listProducts";
import { getProductsByAuthor } from "@/entities/product/api/getProducts";
import { decodePathParam } from "@/shared/lib/routing/decodePathParam";
import { CollectionViewProps } from "../ui/CollectionView";

/* Props of an author page, or null when the author has no products. */
export const loadAuthorView = async (
  authorParam: string,
  params: ListingParams
): Promise<CollectionViewProps | null> => {
  const authorName = decodePathParam(authorParam);
  if (!authorName) return null;

  const products = await getProductsByAuthor(authorName);
  if (!products.length) return null;

  return {
    title: authorName,
    pathname: `/author/${authorParam}`,
    listing: listProducts(products, params),
  };
};
