import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadProductView } from "@/views/product/api/loadProductView";
import { buildProductMetadata } from "@/views/product/api/metadata";
import ProductView from "@/views/product/ui/ProductView";

type ProductPageProps = {
  /* The route's dynamic segments. */
  params: Promise<{ category: string; product: string }>;
};

/**
 * No paths at build time, but declaring the function makes the route ISR:
 * each book is rendered on its first visit and then served from cache until
 * /api/revalidate or the hourly fallback invalidates it.
 */
export function generateStaticParams(): {
  category: string;
  product: string;
}[] {
  return [];
}

/* Title, description and Open Graph image of one book. */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  return buildProductMetadata((await params).product);
}

/**
 * /catalog/<category>/<product>: one book's page; 404 when the slug is not a
 * product.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const view = await loadProductView((await params).product);
  if (!view) notFound();

  return <ProductView {...view} />;
}
