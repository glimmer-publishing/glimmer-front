import "server-only";
import { allInstagramPostsQuery } from "./queries";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import { InstagramPost } from "../model/types";

/**
 * Optional section: a failed read is logged and hides the posts, not the
 * page. On a cached route that empty result stays until the next revalidation.
 */
export const getInstagramPosts = async (): Promise<InstagramPost[]> => {
  const data: { posts?: InstagramPost[] | null } | null | undefined =
    await fetchSanityDataServer(
      allInstagramPostsQuery,
      {},
      { throwError: false }
    );

  return data?.posts ?? [];
};
