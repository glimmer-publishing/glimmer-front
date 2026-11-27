import type { Metadata } from "next";
import { publicEnv } from "@/shared/config/env";

/* The shop's social media pages. */
export const socials = {
  instagram: "https://www.instagram.com/glimmer.publishing/",
  youtube: "https://www.youtube.com",
  tiktok: "https://www.tiktok.com",
  facebook: "https://www.facebook.com",
};

/* The support Telegram account, as shown. */
export const TELEGRAM_NAME = "@glimmerhelp";

/* The support chat in Telegram. */
export const TELEGRAM_URL = "https://t.me/glimmerhelp";

/* The shop's Telegram channel. */
export const TELEGRAM_URL_CHANNEL = "https://t.me/glimmerpublishing";

/* The support phone number. */
export const PHONE = "+380739192523";

/* When support answers. */
export const WORKING_HOURS = "Пн–Пт: 10:00-18:00";

/* Email for customers. */
export const EMAIL_CLIENTS = "hello@glimmer.com.ua";

/* Email for authors and rights holders. */
export const EMAIL_AUTHORS = "rights@glimmer.com.ua";

/* Email for publishing partners. */
export const EMAIL_COOPERATION = "publishing@glimmer.com.ua";

/* KeyCRM's REST API. */
export const CRM_API_URL = "https://openapi.keycrm.app/v1";

/* Nova Poshta's JSON API. */
export const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";

/* The site-wide metadata every page starts from. */
export const DEFAULT_METADATA: Metadata = {
  verification: {
    google: "UebFIihnz9R_v-th8W3BHQi7BCcbYoyMP3PjncbUxcw",
  },
  title: "Glimmer - твій книжковий всесвіт",
  description:
    "Величезний вибір художньої літератури. Glimmer — ваш улюблений книжковий простір. Швидка доставка, вигідні ціни, новинки й бестселери.",
  openGraph: {
    title: "Glimmer - твій книжковий всесвіт",
    description:
      "Величезний вибір художньої літератури. Glimmer — ваш улюблений книжковий простір. Швидка доставка, вигідні ціни, новинки й бестселери.",
    images: [
      {
        url: `${publicEnv.siteUrl}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Glimmer",
      },
    ],
    type: "website",
    locale: "uk_UA",
    siteName: "Glimmer",
  },
};
