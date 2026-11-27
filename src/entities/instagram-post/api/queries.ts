/**
 * The posts of the Instagram document in Studio, always a list: empty when
 * there is no document or it has no posts. A valid query on its own (the
 * about and contacts pages) and embedded in the home page's combined query.
 */
export const instagramPostsProjection = `coalesce(
  *[_type == "instagram"][0].posts[]{
    "image": image.asset->url,
    "alt": image.alt,
    "url": url
  },
  []
)`;
