import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadProductView } from "@/views/product/api/loadProductView";
import { buildProductMetadata } from "@/views/product/api/metadata";
import ProductView from "@/views/product/ui/ProductView";

interface ProductPageProps {
  params: Promise<{ category: string; product: string }>;
}

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

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  return buildProductMetadata((await params).product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const view = await loadProductView((await params).product);
  if (!view) notFound();

  return <ProductView {...view} />;
}
