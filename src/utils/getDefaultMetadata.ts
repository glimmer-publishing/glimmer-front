import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export function getDefaultMetadata(): Metadata {
  return {
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
}
