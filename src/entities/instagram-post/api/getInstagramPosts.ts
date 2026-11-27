import "server-only";
import { instagramPostsProjection } from "./queries";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import type { InstagramPost } from "../model/types";

/**
 * The Instagram posts. Optional section: a failed read is logged and hides
 * the posts, not the page (undefined from fetchSanityDataServer). On a
 * cached route that empty result stays until the next revalidation.
 */
export const getInstagramPosts = async (): Promise<InstagramPost[]> => {
  const posts: InstagramPost[] | undefined = await fetchSanityDataServer(
    instagramPostsProjection,
    {},
    { throwError: false }
  );

  return posts ?? [];
};
