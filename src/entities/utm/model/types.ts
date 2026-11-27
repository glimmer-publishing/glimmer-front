import type { UTM_KEYS } from "../lib/utmParams";

/**
 * First-touch campaign attribution, kept in the browser until an order
 * carries it to KeyCRM. One value per UTM key; a key missing from the
 * landing URL is an empty string.
 */
export type UtmData = Record<(typeof UTM_KEYS)[number], string>;
