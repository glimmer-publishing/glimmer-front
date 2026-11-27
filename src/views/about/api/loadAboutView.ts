import "server-only";
import { getInstagramPosts } from "@/entities/instagram-post/api/getInstagramPosts";
import type { AboutViewProps } from "../model/types";

/* The about page's data: its Instagram posts. */
export const loadAboutView = async (): Promise<AboutViewProps> => ({
  instagramPosts: await getInstagramPosts(),
});
