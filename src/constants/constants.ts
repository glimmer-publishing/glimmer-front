export const socials = {
  instagram: "https://www.instagram.com/glimmer.publishing/",
  youtube: "https://www.youtube.com",
  tiktok: "https://www.tiktok.com",
  facebook: "https://www.facebook.com",
};

export const TELEGRAM_NAME = "@glimmerhelp";

export const TELEGRAM_URL = "https://t.me/glimmerhelp";

export const TELEGRAM_URL_CHANNEL = "https://t.me/glimmerpublishing";

export const PHONE = "+380739192523";

export const WORKING_HOURS = "Пн–Пт: 10:00-18:00";

export const EMAIL_CLIENTS = "hello@glimmer.com.ua";

export const EMAIL_AUTHORS = "rights@glimmer.com.ua";

export const EMAIL_COOPERATION = "publishing@glimmer.com.ua";

export const CRM_API_URL = "https://openapi.keycrm.app/v1";

/**
 * Temporary kill switch: KeyCRM rejects the production API key (401
 * "Unauthenticated."). While false, orders and payments are not sent to
 * KeyCRM in any environment — checkout gets a synthetic order id and the
 * Telegram messages are the only record. Set back to true once the key works.
 */
export const KEYCRM_ENABLED = false;

export const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";
