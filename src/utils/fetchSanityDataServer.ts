import { sanityFetch } from "@/lib/sanityClient";

export const fetchSanityDataServer = async (
  query: string,
  params: Record<string, unknown> = {}
) => {
  try {
    return await sanityFetch(query, params);
  } catch (error) {
    console.warn("Sanity fetch failed:", error);
  }
};
