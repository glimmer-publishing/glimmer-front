import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import AuthorCatalog from "@/components/authorPage/AuthorCatalog";
import { productsByAuthorQuery } from "@/lib/queries";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { Product } from "@/types/product";
import type { Metadata } from "next";
import { getDefaultMetadata } from "@/utils/getDefaultMetadata";

interface AuthorPageProps {
  params: Promise<{ authorName: string }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { authorName } = await params;
  const decodedAuthor = decodeURIComponent(authorName);

  return {
    title:
      `${decodedAuthor} — книги автора. Купити онлайн` ||
      getDefaultMetadata().title,
    description: getDefaultMetadata().description,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { authorName } = await params;

  const decodedAuthor = decodeURIComponent(authorName);

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
      <AuthorCatalog authorName={decodedAuthor} products={products} />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
