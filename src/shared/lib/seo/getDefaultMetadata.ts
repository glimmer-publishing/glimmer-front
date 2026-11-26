import { Metadata } from "next";
import { DEFAULT_METADATA } from "@/shared/config/constants";

/* The site-wide metadata, for pages with nothing of their own. */
export function getDefaultMetadata(): Metadata {
  return DEFAULT_METADATA;
}
