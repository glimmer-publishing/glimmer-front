/**
 * Fallback only: pages are revalidated on demand when content is published
 * (see src/app/api/revalidate). Keep in sync with SANITY_DATA_REVALIDATE.
 */
export const revalidate = 3600;

import { Montserrat } from "next/font/google";
import "./globals.css";
import "react-image-gallery/styles/css/image-gallery.css";
import Header from "@/widgets/header/ui/Header";
import CartHeaderSlot from "@/widgets/cart/ui/CartHeaderSlot";
import Footer from "@/widgets/footer/ui/Footer";
import { getMenuCategories } from "@/entities/category/api/getMenuCategories";
import { getDefaultMetadata } from "@/shared/lib/seo/getDefaultMetadata";
import GoogleBaseTag from "@/shared/ui/analytics/GoogleBaseTag";
import GoogleTagManagerScript from "@/shared/ui/analytics/GoogleTagManagerScript";
import GoogleTagManagerNoScript from "@/shared/ui/analytics/GoogleTagManagerNoScript";
import MetaPixel from "@/shared/ui/analytics/MetaPixel";
import TrackUtm from "@/features/track-utm/ui/TrackUtm";
import { isProduction } from "@/shared/config/env";
import QueryProvider from "@/shared/providers/QueryProvider";

/* The Google Tag Manager container. */
const GTM_ID = "GTM-53NZVT3H";

/* The site font, Latin and Cyrillic, as a CSS variable. */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

/**
 * The site-wide title, description, Open Graph image and Search Console tag.
 */
export async function generateMetadata() {
  return getDefaultMetadata();
}

/**
 * The root layout: fonts, analytics tags (production only), query client, UTM
 * tracking, header with the menu categories and the cart, and footer.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * Categories only: this lands in every page's HTML. Header search loads
   * its product list from /api/search-products when it is first opened.
   */
  const categories = await getMenuCategories();

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
          <TrackUtm />
          <Header categories={categories} cart={<CartHeaderSlot />} />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
