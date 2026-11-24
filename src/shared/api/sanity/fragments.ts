/**
 * GROQ fragments every product query shares. Plain strings, so they are
 * safe to import anywhere.
 */

/**
 * Full genre projection for a product — reads `genres[]`, the only genre field
 * on the product schema. The first entry is treated as the primary genre.
 * Produces:
 *   genres     → array of { slug, title }  (may be empty)
 *   genreSlug  → primary genre slug        (null when no genre at all)
 *   genreTitle → primary genre name        (null when no genre at all)
 */
export const genresProjection = `
    "genres": select(
      count(genres) > 0 => genres[]->{ "slug": slug.current, "title": name },
      []
    ),
    "genreSlug": genres[0]->slug.current,
    "genreTitle": genres[0]->name`;

/**
 * A discount is only live inside its scheduled window. Both bounds are
 * inclusive and either may be absent, in which case that side is unbounded -
 * so a product with a discount price and no dates is on sale permanently,
 * which is how every product behaved before scheduling existed.
 *
 * $today is the Kyiv calendar date, injected by sanityFetch in ./client.ts.
 * Date-only strings sort chronologically, so plain string comparison is
 * correct here. The Studio list caption repeats this rule
 * (glimmer-adm/schemaTypes/product.ts, preview.prepare) - keep the two in sync.
 */
export const activeDiscountFilter = `defined(discountPrice)
    && (!defined(discountDateFrom) || discountDateFrom <= $today)
    && (!defined(discountDateTo) || discountDateTo >= $today)`;

/**
 * Projected instead of a bare `discountPrice`, so an out-of-window product
 * arrives with discountPrice null. Every consumer on the storefront already
 * treats "no discount price" as "no discount", so nothing downstream has to
 * know that scheduling exists.
 */
export const activeDiscountProjection = `
    "discountPrice": select(${activeDiscountFilter} => discountPrice)`;
