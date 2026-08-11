import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "us9jz0mn",
  // Defaults to the production dataset, so a missing variable can never take
  // production offline. Preview sets it explicitly to "preview".
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-07",
  useCdn: true,
});
