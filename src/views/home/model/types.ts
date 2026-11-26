export interface Genre {
  name: string;
  slug: string;
  order: number;
  image: string;
}

/* One hero slide as Studio's heroBanner holds it. */
export interface HeroBanner {
  title: string;
  description: string;
  imageMob: string;
  imageTab: string;
  imageDesk: string;
  button: {
    label: string;
    link: string;
    position: string;
  };
  order: number;
}
