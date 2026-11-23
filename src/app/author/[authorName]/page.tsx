import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import CatalogTitled from "@/components/shared/catalog/CatalogTitled";
import { CatalogService } from "@/services/CatalogService";
import { readCatalogQuery } from "@/utils/catalogListing";
import { CatalogSearchParams } from "@/types/catalog";
import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/constants/constants";
import { decodePathParam } from "@/utils/decodePathParam";

interface AuthorPageProps {
  params: Promise<{ authorName: string }>;
  searchParams: Promise<CatalogSearchParams>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { authorName } = await params;
  const decodedAuthor = decodePathParam(authorName);

  if (!decodedAuthor) return DEFAULT_METADATA;

  return {
    title: `${decodedAuthor} — книги автора. Купити онлайн`,
    description: DEFAULT_METADATA.description,
  };
}

export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const [{ authorName }, query] = await Promise.all([params, searchParams]);
  const decodedAuthor = decodePathParam(authorName);

  if (!decodedAuthor) {
    notFound();
  }

  const books = await CatalogService.getAuthorBooks(
    decodedAuthor,
    readCatalogQuery(query)
  );

  if (!books) {
    notFound();
  }

  const pathname = `/author/${authorName}`;
  const crumbs = [
    { label: "Головна", href: "/" },
    { label: decodedAuthor, href: pathname },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <CatalogTitled
        title={decodedAuthor}
        pathname={pathname}
        searchParams={query}
        page={books.page}
        filter={books.filter}
        sort={books.sort}
        sortOptions={books.sortOptions}
      />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
