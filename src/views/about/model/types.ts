import type { InstagramPost } from "@/entities/instagram-post/model/types";

/* What the about page shows besides its static text. */
export type AboutViewProps = {
  /* Posts of the Instagram section; it hides itself when there are none. */
  instagramPosts: InstagramPost[];
};
