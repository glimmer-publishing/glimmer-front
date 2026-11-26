import "server-only";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import type { InstagramPost } from "@/entities/instagram-post/model/types";
import { Product } from "@/entities/product/model/product";
import { HomepageBanner } from "@/entities/banner/model/types";
import type { Genre, HeroBanner } from "../model/types";
import { homepageCombinedQuery } from "./queries";

/* What homepageCombinedQuery returns. */
type HomePageData = {
  heroBanners?: HeroBanner[];
  homepageBanners?: HomepageBanner[];
  products?: Product[];
  genres?: Genre[];
  instagramPosts: InstagramPost[];
};

/**
 * The home page's data. Throws on a Sanity error: the whole page is this
 * one query, and a soft failure would be cached as an empty home page until
 * the next revalidation.
 */
export const loadHomeView = async () => {
  const data: HomePageData | null = await fetchSanityDataServer(
    homepageCombinedQuery
  );
  const products = data?.products ?? [];
  const banners = data?.homepageBanners ?? [];

  return {
    heroBanners: data?.heroBanners ?? [],
    genres: (data?.genres ?? []).slice().sort((a, b) => a.order - b.order),
    bestsellers: products.filter((product) => product.isBestseller),
    promotionalProducts: products.filter((product) => product.discountPrice),
    newProducts: products.filter((product) => product.isNew),
    promoBannerFirst: banners.find((banner) => banner.order === 1),
    promoBannerSecond: banners.find((banner) => banner.order === 2),
    instagramPosts: data?.instagramPosts ?? [],
  };
};

/* Everything the home page renders. */
export type HomeViewData = Awaited<ReturnType<typeof loadHomeView>>;
