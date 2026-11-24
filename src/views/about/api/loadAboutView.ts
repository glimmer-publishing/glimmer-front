import "server-only";
import { getInstagramPosts } from "@/entities/instagram-post/api/getInstagramPosts";
import { AboutViewProps } from "../ui/AboutView";

export const loadAboutView = async (): Promise<AboutViewProps> => ({
  instagramPosts: await getInstagramPosts(),
});
