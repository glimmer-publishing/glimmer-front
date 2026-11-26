"use client";
import { useSearchParams } from "next/navigation";
import { parseListingParams } from "@/entities/product/model/listingParams";
import { ProductListing } from "@/entities/product/model/types";
import Container from "@/shared/ui/container/Container";
import Loader from "@/shared/ui/loader/Loader";
import ProductGrid from "@/widgets/products/ui/ProductGrid";
import ProductsEmpty from "@/widgets/products/ui/ProductsEmpty";
import { useFavoriteProducts } from "../api/useFavoriteProducts";
import FavoritesEmpty from "./FavoritesEmpty";

interface FavoritesContentProps {
  /* The saved products' listing; null until loaded or when none exists. */
  listing: ProductListing | null;
  /* Nothing is saved in this browser. */
  hasNone: boolean;
  /* The listing request failed. */
  isError: boolean;
}

/**
 * Whatever the favorites state calls for: the grid, the load error, or the
 * empty state.
 */
function FavoritesContent({
  listing,
  hasNone,
  isError,
}: FavoritesContentProps) {
  if (listing && !hasNone) {
    return (
      <ProductGrid
        baseHref="/favorites"
        listing={listing}
        emptyMessage="За обраним фільтром товарів не знайдено"
      />
    );
  }

  if (isError) {
    return <ProductsEmpty message="Не вдалося завантажити обрані товари" />;
  }

  return <FavoritesEmpty />;
}

/**
 * The saved favorites with the filter, sort and page links of the catalog,
 * loaded in the browser from the slugs in the favorites store.
 */
export default function FavoritesListing() {
  // The page is static, so the browser is the edge: parse the URL here.
  const params = parseListingParams(useSearchParams());
  const { listing, hasNone, isLoading, isError } = useFavoriteProducts(params);

  if (isLoading) return <Loader className="h-[460px] lg:h-[580px]" />;

  return (
    <Container>
      <FavoritesContent listing={listing} hasNone={hasNone} isError={isError} />
    </Container>
  );
}
