import "server-only";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import type { MenuCategory } from "../model/types";
import { menuCategoriesQuery } from "./queries";

/**
 * Every category for the header menu. It lands in every page's HTML, so it
 * throws on a Sanity error: a failed rebuild keeps the cached page instead
 * of caching one with an empty catalog menu.
 */
export const getMenuCategories = async (): Promise<MenuCategory[]> =>
  (await fetchSanityDataServer(menuCategoriesQuery)) ?? [];
