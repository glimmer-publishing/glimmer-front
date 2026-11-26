import {
  activeDiscountProjection,
  genresProjection,
} from "@/shared/api/sanity/fragments";
import { instagramPostsProjection } from "@/entities/instagram-post/api/queries";

/**
 * Everything the home page shows, in one read: hero and promo banners, all
 * products (bestsellers, new and discounted are picked from them), genres
 * and the Instagram feed.
 */
export const homepageCombinedQuery = `{
  "heroBanners": *[_type == "heroBanner"] | order(order asc) {
    title,
    description,
    "imageMob": imageMob.asset->url,
    "imageTab": imageTab.asset->url,
    "imageDesk": imageDesk.asset->url,
    button {
      label,
      link,
      position
    },
    order
  },
  "homepageBanners": *[_type == "homepageBanner"] | order(order asc) {
    "imageSmall": imageSmall.asset->url,
    "imageLarge": imageLarge.asset->url,
    "imageCatalog": imageCatalog.asset->url,
    link,
    showOnCatalog,
    order
  },
  "products": *[_type == "product"]{
    "id": _id,
    "slug": slug.current,
    title,
    author,
    price,
    ${activeDiscountProjection},
    "mainImage": gallery[0].asset->url,
    status,
    isBestseller,
    isNew,
    isNationalCashback,
    sku,
    preOrderShippingDate,
    features[]{
      "featureName": feature->name,
      value
    },
    "reviews": reviews[]{
      author,
      rating,
      text
    },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    ${genresProjection}
  },
  "genres": *[_type == "genre"] | order(order asc) {
    name,
    "slug": slug.current,
    order,
    "image": image.asset->url
  },
  "instagramPosts": ${instagramPostsProjection}
}`;
