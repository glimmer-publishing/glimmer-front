import "server-only";
import { getInstagramPosts } from "@/entities/instagram-post/api/getInstagramPosts";

/* What the contacts page reads: the Instagram feed, which never throws. */
export const loadContactsView = async () => ({
  instagramPosts: await getInstagramPosts(),
});
