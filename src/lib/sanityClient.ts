import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "us9jz0mn",
  dataset: "production",
  apiVersion: "2025-08-07",
  useCdn: true,
});
