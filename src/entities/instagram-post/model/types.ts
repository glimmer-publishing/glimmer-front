/* One post of the Instagram section, linking to the post on Instagram. */
export type InstagramPost = {
  /* Sanity CDN URL of the post's image. */
  image: string;
  alt?: string;
  /* The post on instagram.com. */
  url: string;
};
