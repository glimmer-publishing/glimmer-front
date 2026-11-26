"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/shared/api/http/fetchJson";
import type { SearchProduct } from "../model/types";

/**
 * The search list from GET /api/search-products, loaded the first time
 * search opens rather than embedded in every page. The header lives in the
 * root layout, so the list survives client-side navigation; a failed load is
 * retried the next time search opens.
 */
export const useFetchSearchProducts = (isOpen: boolean) =>
  useQuery({
    queryKey: ["search-products"],
    queryFn: ({ signal }) =>
      fetchJson<SearchProduct[]>("/api/search-products", signal),
    enabled: isOpen,
    staleTime: Infinity,
  });
