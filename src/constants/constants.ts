import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

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

export const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";

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
        url: `${SITE_URL}/opengraph-image.jpg`,
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
