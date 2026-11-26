/**
 * The posts of the Instagram document in Studio, always a list: empty when
 * there is no document or it has no posts. The home page embeds it in its
 * combined query.
 */
export const instagramPostsProjection = `coalesce(
  *[_type == "instagram"][0].posts[]{
    "image": image.asset->url,
    "alt": image.alt,
    "url": url
  },
  []
)`;

/* The Instagram posts on their own, for the about and contacts pages. */
export const allInstagramPostsQuery = instagramPostsProjection;
