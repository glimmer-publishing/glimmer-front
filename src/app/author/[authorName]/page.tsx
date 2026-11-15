import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import ListingCatalog from "@/components/shared/listingCatalog/ListingCatalog";
import { productsByAuthorQuery } from "@/lib/queries";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { connection } from "next/server";
import { Product } from "@/types/product";
import type { Metadata } from "next";
import { getDefaultMetadata } from "@/utils/getDefaultMetadata";

interface AuthorPageProps {
  params: Promise<{ authorName: string }>;
}

/* A malformed escape ("%E0%A4%A") makes decodeURIComponent throw; treat it as
   an unknown author (404) rather than a 500. */
function decodeAuthorName(authorName: string): string | null {
  try {
    return decodeURIComponent(authorName);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { authorName } = await params;
  const decodedAuthor = decodeAuthorName(authorName);

  if (!decodedAuthor) return getDefaultMetadata();

  return {
    title:
      `${decodedAuthor} — книги автора. Купити онлайн` ||
      getDefaultMetadata().title,
    description: getDefaultMetadata().description,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { authorName } = await params;

  // Rendered per request: the list for the current ?sort/filter/page/
  // subcategory is in the server HTML from the first paint. Sanity data still
  // comes from the tagged data cache, so this costs a render, not a query.
  await connection();

  const decodedAuthor = decodeAuthorName(authorName);

  if (!decodedAuthor) {
    notFound();
  }

  // Throws on a Sanity error, so an outage shows an error page rather than
  // telling visitors (and crawlers) the page does not exist.
  const products: Product[] = await fetchSanityDataServer(
    productsByAuthorQuery,
    { authorName: decodedAuthor }
  );

  if (!products || products.length === 0) {
    notFound();
  }

  const crumbs = [
    { label: "Головна", href: "/" },
    { label: decodedAuthor, href: `/author/${authorName}` },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <ListingCatalog title={decodedAuthor} products={products} />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
