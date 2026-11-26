/* A genre card of the home page. */
export type Genre = {
  name: string;
  /* Slug of the genre tab it links to. */
  slug: string;
  /* Position among the genres, from Studio. */
  order: number;
  /* Sanity CDN URL of the card image. */
  image: string;
};

/* One hero slide as Studio's heroBanner holds it. */
export type HeroBanner = {
  title: string;
  description: string;
  /* Sanity CDN URLs of the image per breakpoint. */
  imageMob: string;
  imageTab: string;
  imageDesk: string;
  /* The call to action: its text, target and where it sits on the slide. */
  button: {
    label: string;
    link: string;
    position: string;
  };
  /* Position among the slides, from Studio. */
  order: number;
};
