/* Field errors for a promo code the server rejected. */
export const PROMO_ERRORS = {
  notFound: "Промокод не знайдений",
  expired: "Термін дії промокоду вичерпано",
} as const;

/* Nova Poshta cities are searched once this many characters are typed. */
export const CITY_SEARCH_MIN_LENGTH = 2;
/* Wait after the last keystroke before searching cities, in ms. */
export const CITY_SEARCH_DEBOUNCE_MS = 300;

/* How long Nova Poshta cities and branches stay fresh in the query cache, in ms. */
export const NOVA_POSHTA_STALE_TIME_MS = 5 * 60_000;
