/**
 * A promo banner of the home page (order 1 or 2), optionally also shown on
 * catalog pages.
 */
export type HomepageBanner = {
  imageSmall: string;
  imageLarge: string;
  imageCatalog?: string;
  link: string;
  showOnCatalog: boolean;
  order: number;
};

/**
 * The homepage banner marked "show on catalog" in Studio, as the catalog
 * queries project it. Here because both the category and the product
 * selection reads return it.
 */
export type CatalogBanner = {
  imageCatalog: string;
  link?: string;
};
