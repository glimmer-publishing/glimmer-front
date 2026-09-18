import { createClient } from "next-sanity";
import { getKyivDate } from "@/utils/getKyivDate";

const client = createClient({
  projectId: "us9jz0mn",
  // Defaults to the production dataset, so a missing variable can never take
  // production offline. Preview sets it explicitly to "preview".
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-07",
  useCdn: true,
});

// The only way to query Sanity from the storefront. Every query receives
// $today (the Kyiv calendar date), which the discount-window fragments in
// src/lib/queries.ts depend on - a query that uses them without $today fails.
// The client itself is deliberately not exported so no call can bypass this.
// $today is set after the caller's params, so a browser request through
// /api/sanity cannot override which prices it is offered.
export const sanityFetch = (
  query: string,
  params: Record<string, unknown> = {}
) => client.fetch(query, { ...params, today: getKyivDate() });
