/**
 * First-touch campaign attribution, kept in the browser until an order
 * carries it to KeyCRM.
 */
export interface UtmData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}
