export interface HomepageBanner {
  imageSmall: string;
  imageLarge: string;
  imageCatalog?: string;
  link: string;
  showOnCatalog: boolean;
  order: number;
};

/* The homepage banner marked "show on catalog" in Studio, as the catalog
   queries project it. Here because both the category and the product
   selection reads return it. */
export interface CatalogBanner {
  imageCatalog: string;
  link?: string;
}
