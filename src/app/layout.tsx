// Fallback only: pages are revalidated on demand when content is published
// (see src/app/api/revalidate). Keep in sync with SANITY_DATA_REVALIDATE.
export const revalidate = 3600;

import { Montserrat } from "next/font/google";
import "./globals.css";
import "react-image-gallery/styles/css/image-gallery.css";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import { allCategoriesQuery } from "@/lib/queries";
import { getDefaultMetadata } from "@/utils/getDefaultMetadata";
import GoogleBaseTag from "@/components/shared/gtm/GoogleBaseTag";
import GoogleTagManagerScript from "@/components/shared/gtm/GoogleTagManagerScript";
import GoogleTagManagerNoScript from "@/components/shared/gtm/GoogleTagManagerNoScript";
import MetaPixel from "@/components/shared/gtm/MetaPixel";
import UtmTracker from "@/components/shared/utmTracker/UtmTracker";
import { isProduction } from "@/lib/env";
import QueryProvider from "./_providers/QueryProvider";

const GTM_ID = "GTM-53NZVT3H";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata() {
  return getDefaultMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Categories only: this lands in every page's HTML. Header search loads its
  // product list from /api/search-products when it is first opened.
  // Throws on a Sanity error, so a failed rebuild keeps the cached page
  // instead of caching one with an empty catalog menu.
  const categories = await fetchSanityDataServer(allCategoriesQuery);

  return (
    <html lang="uk" className="scroll-smooth antialiased">
      <head>
        {isProduction && (
          <>
            <GoogleBaseTag />
            <GoogleTagManagerScript gtmId={GTM_ID} />
            <MetaPixel />
          </>
        )}
      </head>
      <body
        className={`${montserrat.variable} flex min-h-dvh flex-col antialiased text-[12px] lg:text-[15px] font-light leading-[120%]`}
      >
        {isProduction && <GoogleTagManagerNoScript gtmId={GTM_ID} />}
        <QueryProvider>
          <UtmTracker />
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
